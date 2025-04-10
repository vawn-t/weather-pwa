import { LocationCard, MyLocationsHeader } from '@components';
import { MobileLayout } from '@layouts';

const MyLocations = () => {
  const locations = [
    {
      city: 'Paris',
      condition: 'Clear',
      humidity: '56',
      wind: '4.63',
      icon: '01n',
      temperature: 24,
    },
    {
      city: 'London',
      condition: 'Clouds',
      humidity: '65',
      wind: '4.12',
      icon: '02d',
      temperature: 16,
    },
    {
      city: 'New York',
      condition: 'Thunderstorm',
      humidity: '34',
      wind: '9.26',
      icon: '09d',
      temperature: 25,
    },
  ];

  return (
    <MobileLayout className="bg-gradient-to-b from-[#391A49] via-[#301D5C] via-[#262171] via-[#301D5C] to-[#391A49]">
      <MyLocationsHeader />

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
    </MobileLayout>
  );
};

export default MyLocations;
