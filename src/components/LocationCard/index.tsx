import { memo, useCallback, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

// Hooks
import { useWeatherIcon } from '@hooks';

// Components
import { Button, Text } from '../commons';
import { DeleteIcon } from '../icons';

interface LocationCardProps {
  city: string;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
  temperature: number;
  dateAdded: number;
  draggable?: boolean;
  index: number;
  onTouchMove?: (
    id: number,
    index: number,
    clientX: number,
    clientY: number
  ) => void;
  onTouchEnd?: (
    id: number,
    index: number,
    clientX: number,
    clientY: number
  ) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDelete: (id: number) => void;
}

const LocationCard = ({
  city,
  condition,
  humidity,
  wind,
  icon,
  temperature,
  dateAdded,
  draggable = true,
  index,
  onTouchMove,
  onTouchEnd,
  onDragStart,
  onDragEnd,
  onDelete,
}: LocationCardProps) => {
  const weatherIcon = useWeatherIcon(icon);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const touchStartPosition = useRef({ x: 0, y: 0 });
  const originalPosition = useRef({ top: 0, left: 0 });

  // Clean up function for touch events
  useEffect(() => {
    return () => {
      if (cardRef.current) {
        // Reset any inline styles when component unmounts
        cardRef.current.style.transform = '';
        cardRef.current.style.zIndex = '';
        cardRef.current.style.position = '';
      }
    };
  }, []);

  // Touch event handlers for mobile support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (!draggable) return;

      onDragStart();

      const touch = e.touches[0];
      touchStartPosition.current = { x: touch.clientX, y: touch.clientY };

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        originalPosition.current = { top: rect.top, left: rect.left };
      }

      // Short delay to distinguish between tap and drag
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.zIndex = '50';
          cardRef.current.style.position = 'relative';
        }
      }, 150);
    },
    [draggable, onDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (!draggable) return;

      // Prevent scrolling while dragging
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPosition.current.x;
      const deltaY = touch.clientY - touchStartPosition.current.y;

      if (cardRef.current) {
        cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        setIsDragging(true);

        onTouchMove?.(dateAdded, index, touch.clientX, touch.clientY);
      }
    },
    [draggable, dateAdded, index, onTouchMove]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      setIsDragging(false);

      if (cardRef.current) {
        // Reset transformation
        cardRef.current.style.transform = '';
        cardRef.current.style.zIndex = '';
        cardRef.current.style.position = '';

        // Determine final position for drop handling
        const touch = e.changedTouches[0];
        onTouchEnd?.(dateAdded, index, touch.clientX, touch.clientY);
      }

      onDragEnd();
    },
    [onDragEnd, onTouchEnd, dateAdded, index]
  );

  const handleDelete = useCallback(() => {
    onDelete(dateAdded);
  }, [onDelete, dateAdded]);

  return (
    <section
      ref={cardRef}
      className={classNames(
        `bg-[#AAA5A5]/30 backdrop-blur-sm rounded-xl p-6 sm:px-8 flex justify-between items-center mb-6 mx-4 relative`,
        { 'opacity-50': isDragging }
      )}
      draggable={draggable}
      data-id={dateAdded}
      data-index={index}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Button
        className="hidden sm:block absolute top-2 right-2 hover:bg-amber-800 rounded-full p-1 transition-all duration-200 ease-in-out"
        onClick={handleDelete}
      >
        <DeleteIcon />
      </Button>

      {/* Left Side Info */}
      <div className="flex flex-col text-gray-200">
        <Text className="text-2xl font-semibold mb-1">{city}</Text>
        <Text className="font-medium">{condition}</Text>
        <span className="text-xs font-light">
          Humidity <Text as="span">{humidity}%</Text>
        </span>
        <span className="text-xs font-light">
          Wind <Text as="span">{wind}km/h</Text>
        </span>
      </div>

      {/* Right Side Icon & Temp */}
      <div className="flex flex-col items-end gap-1">
        <img className="w-10" src={weatherIcon} alt="Weather icon" />
        <Text className="text-5xl font-medium">
          {temperature.toFixed()}
          <span className="align-top text-2xl ml-0.5">&deg;c</span>
        </Text>
      </div>
    </section>
  );
};

export default memo(LocationCard);
