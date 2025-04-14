import { useState, useEffect, useRef, ChangeEvent, memo } from 'react';
import { Button, Input, Text } from '../commons';
import { Location } from '@models';

// --- Simulated API Data / Function ---
// Replace this with your actual API call (e.g., to OpenWeatherMap Geocoding API)
const ALL_POSSIBLE_LOCATIONS: Location[] = [
  { id: 'lon', name: 'London', country: 'GB' },
  { id: 'par', name: 'Paris', country: 'FR' },
  { id: 'nyc', name: 'New York', country: 'US' },
  { id: 'tok', name: 'Tokyo', country: 'JP' },
  { id: 'ber', name: 'Berlin', country: 'DE' },
  { id: 'syd', name: 'Sydney', country: 'AU' },
  { id: 'mos', name: 'Moscow', country: 'RU' },
  { id: 'bei', name: 'Beijing', country: 'CN' },
  { id: 'rom', name: 'Rome', country: 'IT' },
  { id: 'cai', name: 'Cairo', country: 'EG' },
  { id: 'rio', name: 'Rio de Janeiro', country: 'BR' },
  { id: 'del', name: 'Delhi', country: 'IN' },
];

const fetchSimulatedResults = async (query: string): Promise<Location[]> => {
  console.log(`Simulating API call for: ${query}`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();
  return ALL_POSSIBLE_LOCATIONS.filter(
    (location) =>
      location.name.toLowerCase().includes(lowerCaseQuery) ||
      location.country.toLowerCase().includes(lowerCaseQuery)
  );
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (location: Location) => void;
  // Add alternative prop name for compatibility with MyLocation component
  onSelectLocation?: (location: Location) => void;
}

const SearchModal = ({
  isOpen,
  onClose,
  onAddLocation,
  onSelectLocation,
}: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use either onAddLocation or onSelectLocation (for backward compatibility)
  const handleLocationSelection = onAddLocation || onSelectLocation;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();

      setSearchQuery('');
      setResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Debounced search effect
  useEffect(() => {
    // Clear the previous timeout if query changes quickly
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchQuery.trim().length > 1) {
      // Only search if query is > 1 char
      setIsLoading(true);
      setResults([]); // Clear previous results immediately

      // Set a new timeout
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const fetchedResults = await fetchSimulatedResults(searchQuery);
          setResults(fetchedResults);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]); // Clear results on error
        } finally {
          setIsLoading(false);
        }
      }, 500); // 500ms debounce time
    } else {
      setResults([]);
      setIsLoading(false); // Ensure loading is off if query is short
    }

    // Cleanup function to clear timeout if component unmounts or query changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]); // Re-run effect when searchQuery changes

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleResultClick = (location: Location) => {
    if (handleLocationSelection) {
      handleLocationSelection(location);
    }
    // onClose(); // onAddLocation handles closing in the parent now
  };

  // Handle closing via Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    // Modal backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Modal content - stop propagation to prevent closing when clicking inside */}
      <div
        className="bg-gray-600/80 p-5 rounded-lg shadow-xl w-full max-w-md relative text-white"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click closing
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-300 hover:text-white text-2xl font-bold"
          aria-label="Close search modal"
        >
          ×
        </Button>

        <Text as="h2" className="text-lg font-semibold mb-4">
          Search Location
        </Text>

        {/* Search Input */}
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter city name..."
          className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent focus:border-blue-400"
        />

        {/* Results Area */}
        <div className="mt-4 max-h-60 overflow-y-auto pr-2">
          {/* Added pr-2 for scrollbar space */}
          {isLoading && (
            <Text variant="secondary" className="text-center py-2">
              Searching...
            </Text>
          )}
          {!isLoading && searchQuery.length > 1 && results.length === 0 && (
            <Text className="text-center py-2">No results found.</Text>
          )}
          {!isLoading && results.length > 0 && (
            <ul>
              {results.map((location) => (
                <li
                  key={location.id} // Use unique ID
                  onClick={() => handleResultClick(location)}
                  className="p-2 hover:bg-white/20 rounded cursor-pointer transition duration-150 ease-in-out"
                >
                  <Text>
                    {location.name}, {location.country}
                  </Text>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(SearchModal);
