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
  PullToRefresh,
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

  useEffect(() => {
    const loadSavedLocations = async () => {
      try {
        setIsLoading(true);
        const savedLocations = await getLocations();
        if (savedLocations && savedLocations.length > 0) {
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
            const dateAdded = Date.now();
            const newLocation: OpenWeatherMap = {
              ...location,
              name: selectedCity.name,
              dateAdded,
            };

            setLocations((prevLocations) => [...prevLocations, newLocation]);

            await addLocation(newLocation, dateAdded);
          }
        } catch (error) {
          console.error('Failed to fetch weather data:', error);
        }
      } else {
        console.warn(`${selectedCity.name} already exists.`);
      }

      closeModal();
    },
    [locations, closeModal, asyncFetchWeather]
  );

  const handleDeleteLocation = useCallback(async (dateAdded: number) => {
    try {
      await deleteLocation(dateAdded);

      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.dateAdded !== dateAdded)
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

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    draggedOverItemId.current = null;
  }, []);

  const handleTouchMove = useCallback(
    (dateAdded: number, _index: number, clientX: number, clientY: number) => {
      // Find the element under the touch point (excluding the dragged element)
      const elementsAtPoint = document.elementsFromPoint(clientX, clientY);
      const cardUnderTouch = elementsAtPoint.find((elem) => {
        const cardId = elem.getAttribute('data-id');
        return cardId && Number(cardId) !== dateAdded;
      });

      if (cardUnderTouch && cardUnderTouch.getAttribute('data-id')) {
        const targetId = Number(cardUnderTouch.getAttribute('data-id'));

        draggedOverItemId.current = targetId;

        // Reorder locations
        setLocations((prevLocations) => {
          const draggedItemIndex = prevLocations.findIndex(
            (loc) => loc.dateAdded === dateAdded
          );
          const draggedOverItemIndex = prevLocations.findIndex(
            (loc) => loc.dateAdded === targetId
          );

          if (draggedItemIndex === -1 || draggedOverItemIndex === -1)
            return prevLocations;

          const newLocations = [...prevLocations];
          const [draggedItem] = newLocations.splice(draggedItemIndex, 1);
          newLocations.splice(draggedOverItemIndex, 0, draggedItem);

          return newLocations;
        });
      }
    },
    []
  );

  const handleTouchEnd = useCallback(
    (dateAdded: number, _index: number, clientX: number, clientY: number) => {
      // Check if the card was dropped on the trash bin
      const trashBin = document.querySelector('[data-id="trash-bin"]');

      if (trashBin) {
        const trashRect = trashBin.getBoundingClientRect();
        const isOverTrash =
          clientX >= trashRect.left &&
          clientX <= trashRect.right &&
          clientY >= trashRect.top &&
          clientY <= trashRect.bottom;

        if (isOverTrash) {
          handleDeleteLocation(dateAdded).then(() => {
            console.error('Failed to delete location:');
          });
        } else {
          updateLocationOrder(locations).catch((err) => {
            console.error('Failed to update location order after touch:', err);
          });
        }
      }

      draggedOverItemId.current = null;
    },
    [locations, handleDeleteLocation]
  );

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const updatedLocationsPromises = locations.map((item) =>
        asyncFetchWeather({
          latitude: item.coord.lat,
          longitude: item.coord.lon,
          accuracy: 0,
          timestamp: Date.now(),
        }).then((res) => {
          if (!res) {
            throw new Error(`Failed to fetch weather data for ${item.name}`);
          }
          return { ...res, name: item.name }; // Ensure name is preserved
        })
      );

      const updatedLocations = await Promise.all(updatedLocationsPromises);

      setLocations(updatedLocations);
      await updateLocationOrder(updatedLocations);
    } catch (error) {
      console.error('Failed to refresh locations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [locations, asyncFetchWeather]);

  return (
    <MobileLayout className={classNames(COLORS.GRADIENT)}>
      <PullToRefresh
        className="flex flex-col gap-6"
        onRefresh={handleRefresh}
        disabled={isDragging}
      >
        <SwipeNavigation onGoBack={handleGoBack}>
          <MyLocationsHeader onOpenModal={openModal} onGoBack={handleGoBack} />

          <div
            className="flex-grow overflow-y-auto"
            ref={locationsContainerRef}
          >
            {isLoading ? (
              <div className="p-2 space-y-4">
                {[...Array(Math.max(locations.length, 1))].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : locations.length > 0 ? (
              locations.map((loc, index) => (
                <LocationCard
                  draggable
                  dateAdded={loc.dateAdded}
                  key={loc.id || `loc-${index}`}
                  city={loc.name}
                  condition={loc.weather[0]?.main || 'Unknown'}
                  humidity={loc.main?.humidity || 0}
                  wind={loc.wind?.speed || 0}
                  icon={loc.weather[0]?.icon || '01d'}
                  temperature={loc.main?.temp || 0}
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
      </PullToRefresh>
    </MobileLayout>
  );
};

export default MyLocations;
