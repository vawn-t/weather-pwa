import { LocationCard, MyLocationsHeader, SearchModal } from '@components';
import { MobileLayout } from '@layouts';
import { Location, Weather } from '@models';
import { useCallback, useState } from 'react';

const MyLocations = () => {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for saved locations (example)
  const [locations, setLocations] = useState<Weather[]>([
    {
      city: 'Paris',
      condition: 'Clear',
      humidity: 56,
      wind: 4.63,
      icon: '01n',
      temperature: 24,
    },
    {
      city: 'London',
      condition: 'Clouds',
      humidity: 65,
      wind: 4.12,
      icon: '02d',
      temperature: 16,
    },
    {
      city: 'New York',
      condition: 'Thunderstorm',
      humidity: 34,
      wind: 9.26,
      icon: '09d',
      temperature: 25,
    },
  ]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Function to add a new location (passed to the modal)
  // This is a placeholder - you'll need to fetch actual weather data here
  const handleAddLocation = useCallback(
    (selectedCity: Location) => {
      console.log('Adding location:', selectedCity);
      // --- Placeholder: Fetch real data for selectedCity ---
      // Example: Fetch weather data from an API using selectedCity.name
      // For now, we'll just add it with dummy data if it's not already added
      const alreadyExists = locations.some(
        (loc) => loc.city.toLowerCase() === selectedCity.city.toLowerCase()
      );

      if (!alreadyExists) {
        const newLocation = {
          id: Date.now(), // Use a better ID generation in a real app
          city: selectedCity.city,
          condition: 'Fetching...', // Placeholder until data is loaded
          humidity: '--%',
          wind: '--km/h',
          icon: '⏳',
          temperature: '--',
        };
        setLocations((prevLocations) => [...prevLocations, newLocation]);
        // TODO: Trigger actual data fetch for this newLocation here
      } else {
        console.log(`${selectedCity.name} already exists.`);
        // Optional: Show a message to the user
      }

      closeModal(); // Close the modal after selection
    },
    [locations, closeModal]
  ); // Include dependencies

  return (
    <MobileLayout className="bg-gradient-to-b from-[#391A49] via-[#301D5C] via-[#262171] via-[#301D5C] to-[#391A49] gap-6">
      <MyLocationsHeader onOpenModal={openModal} />

      <div className="flex-grow overflow-y-auto">
        {locations.map((loc) => (
          <LocationCard
            key={loc.city}
            city={loc.city}
            condition={loc.condition}
            humidity={loc.humidity}
            wind={loc.wind}
            icon={loc.icon}
            temperature={loc.temperature}
          />
        ))}
      </div>

      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddLocation={handleAddLocation}
      />
    </MobileLayout>
  );
};

export default MyLocations;
