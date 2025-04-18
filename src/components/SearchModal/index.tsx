import { useState, useEffect, useRef, ChangeEvent, memo } from 'react';

// Components
import { Button, Input, Text } from '../commons';

// Models
import { OpenWeatherMapLocation } from '@models';

// Hooks
import { useSearchLocation } from '@hooks';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (location: OpenWeatherMapLocation) => void;
}

const SearchModal = ({ isOpen, onClose, onAddLocation }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<OpenWeatherMapLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { findLocations } = useSearchLocation();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();

      setSearchQuery('');
      setResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Clear the previous timeout if query changes quickly
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchQuery.trim().length > 1) {
      setIsLoading(true);
      setResults([]);

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const fetchedResults = await findLocations(searchQuery);
          setResults(fetchedResults);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]); // Re-run effect when searchQuery changes

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
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

        <div className="mt-4 max-h-60 overflow-y-auto pr-2">
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
              {results.map((location, index) => (
                <li
                  key={location.country + index}
                  onClick={() => onAddLocation(location)}
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
