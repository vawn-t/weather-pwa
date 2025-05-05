import { useCallback, useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router';

// Components
import {
  LocationCard,
  MyLocationsHeader,
  SearchModal,
  SwipeNavigation,
  Text,
  SkeletonCard,
  TrashBin,
} from '@components';

// Layouts
import { MobileLayout } from '@layouts';

// Models
import { OpenWeatherMap, OpenWeatherMapLocation } from '@models';

// Hooks
import { useWeather } from '@hooks';

// Constants
import { APP_ROUTES, COLORS } from '@constants';

// Stores
import {
  getLocations,
  addLocation,
  deleteLocation,
  updateLocationOrder,
} from '@stores';

const MyLocations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState<OpenWeatherMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const draggedOverItemId = useRef<number | null>(null);
  const locationsContainerRef = useRef<HTMLDivElement>(null);

  const { asyncFetchWeather } = useWeather(null);
  const navigate = useNavigate();
  const location = useLocation();

  const canGoBack = location.key !== 'default';

  // Load saved locations from IndexedDB on component mount
  useEffect(() => {
    const loadSavedLocations = async () => {
      try {
        setIsLoading(true);
        const savedLocations = await getLocations();
        if (savedLocations && savedLocations.length > 0) {
          // Extract the weather data from each record
          const weatherData = savedLocations.map((loc) => loc.data);
          setLocations(weatherData);
        }
      } catch (error) {
        console.error('Failed to load saved locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLocations();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAddLocation = useCallback(
    async (selectedCity: OpenWeatherMapLocation) => {
      const alreadyExists = locations.some(
        (loc) => loc.name.toLowerCase() === selectedCity.name.toLowerCase()
      );

      if (!alreadyExists) {
        try {
          const location = await asyncFetchWeather({
            latitude: selectedCity.lat,
            longitude: selectedCity.lon,
            accuracy: 0,
            timestamp: Date.now(),
          });

          if (location) {
            const newLocation: OpenWeatherMap = {
              ...location,
              name: selectedCity.name,
            };

            setLocations((prevLocations) => [...prevLocations, newLocation]);

            await addLocation(newLocation);
          }
        } catch (error) {
          console.error('Failed to fetch weather data:', error);
        }
      } else {
        // TODO: Show a message to the user
        console.warn(`${selectedCity.name} already exists.`);
      }

      closeModal();
    },
    [locations, closeModal, asyncFetchWeather]
  );

  // Handler for deleting a location
  const handleDeleteLocation = useCallback(async (id: number) => {
    try {
      await deleteLocation(id);

      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(APP_ROUTES.HOME);
    }
  }, [canGoBack, navigate]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    draggedOverItemId.current = null;
  }, []);

  // Handle touch move for mobile drag and drop
  const handleTouchMove = useCallback(
    (id: number, _index: number, clientX: number, clientY: number) => {
      // Find the element under the touch point (excluding the dragged element)
      const elementsAtPoint = document.elementsFromPoint(clientX, clientY);
      const cardUnderTouch = elementsAtPoint.find((elem) => {
        const cardId = elem.getAttribute('data-id');
        return cardId && Number(cardId) !== id;
      });

      if (cardUnderTouch && cardUnderTouch.getAttribute('data-id')) {
        const targetId = Number(cardUnderTouch.getAttribute('data-id'));

        if (targetId !== draggedOverItemId.current) {
          draggedOverItemId.current = targetId;

          // Reorder locations
          setLocations((prevLocations) => {
            const draggedItemIndex = prevLocations.findIndex(
              (loc) => loc.id === id
            );
            const draggedOverItemIndex = prevLocations.findIndex(
              (loc) => loc.id === targetId
            );

            if (draggedItemIndex === -1 || draggedOverItemIndex === -1)
              return prevLocations;

            // Create a new array with the items reordered
            const newLocations = [...prevLocations];
            const [draggedItem] = newLocations.splice(draggedItemIndex, 1);
            newLocations.splice(draggedOverItemIndex, 0, draggedItem);

            return newLocations;
          });
        }
      }
    },
    []
  );

  // Handle touch end for mobile drag and drop
  const handleTouchEnd = useCallback(
    (id: number, _index: number, clientX: number, clientY: number) => {
      // Check if the card was dropped on the trash bin
      const trashBin = document.querySelector('[data-testid="trash-bin"]');

      if (trashBin) {
        const trashRect = trashBin.getBoundingClientRect();
        const isOverTrash =
          clientX >= trashRect.left &&
          clientX <= trashRect.right &&
          clientY >= trashRect.top &&
          clientY <= trashRect.bottom;

        if (isOverTrash) {
          // Delete the item
          handleDeleteLocation(id);
        } else {
          // Update the order in the database
          updateLocationOrder(locations).catch((err) => {
            console.error('Failed to update location order after touch:', err);
          });
        }
      }

      draggedOverItemId.current = null;
    },
    [locations, handleDeleteLocation]
  );

  return (
    <MobileLayout className={classNames('gap-6', COLORS.GRADIENT)}>
      <SwipeNavigation onGoBack={handleGoBack}>
        <MyLocationsHeader onOpenModal={openModal} onGoBack={handleGoBack} />

        <div className="flex-grow overflow-y-auto" ref={locationsContainerRef}>
          {isLoading ? (
            <div className="p-2">
              {[...Array(3)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : locations.length > 0 ? (
            locations.map((loc, index) => (
              <LocationCard
                draggable
                id={loc.id}
                key={loc.id}
                city={loc.name}
                condition={loc.weather[0].main}
                humidity={loc.main.humidity}
                wind={loc.wind.speed}
                icon={loc.weather[0].icon}
                temperature={loc.main.temp}
                index={index}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            ))
          ) : (
            <Text className="text-white text-center py-8">
              No saved locations. Add a location to get started.
            </Text>
          )}
        </div>
      </SwipeNavigation>

      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddLocation={handleAddLocation}
      />

      <TrashBin visible={isDragging} onDrop={handleDeleteLocation} />
    </MobileLayout>
  );
};

export default MyLocations;
