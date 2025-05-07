import { FC, useState, useEffect } from 'react';
import { TrashBinIcon } from '../icons';

interface TrashBinProps {
  visible: boolean;
  onDrop: (itemId: number) => void;
}

const TrashBin: FC<TrashBinProps> = ({ visible, onDrop }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Add a small delay to the appearance/disappearance of the trash bin
  // for a smoother UX
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      setIsVisible(true);
    } else {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [visible]);

  if (!isVisible) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      // Extract the id from the dragged item
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (dragData && dragData.id) {
        onDrop(dragData.id);
      }
    } catch (error) {
      console.error('Error handling item drop in trash bin:', error);
    } finally {
      setIsHovering(false);
    }
  };

  return (
    <div
      className={`fixed left-1/2 bottom-10 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${isHovering ? 'bg-red-600 scale-125' : 'bg-red-500'}`}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseOver={handleDragOver}
      data-id="trash-bin"
    >
      <div
        className={`text-white transition-all ${isHovering ? 'scale-125' : 'scale-100'}`}
      >
        <TrashBinIcon />
      </div>
    </div>
  );
};

export default TrashBin;
