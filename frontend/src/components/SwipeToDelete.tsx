import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
}

export default function SwipeToDelete({ children, onDelete }: SwipeToDeleteProps) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Only allow swipe left
    if (diff < 0) {
      // Add resistance
      setOffset(Math.max(diff, -100));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offset < -60) {
      onDelete();
      // Optionally animate fully off screen before unmounting
      setOffset(-1000); 
    } else {
      setOffset(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl mb-4 group">
      {/* Delete Background */}
      <div className="absolute inset-0 bg-red-500 flex justify-end items-center px-8 z-0">
        <Trash2 className="text-white w-6 h-6" />
      </div>
      
      {/* Foreground Content */}
      <div 
        className="relative z-10 transition-transform duration-200 ease-out h-full bg-white"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
