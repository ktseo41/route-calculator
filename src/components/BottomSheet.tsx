import React, { useEffect, useState, useRef, TouchEvent } from 'react';
import '../prototype.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setTranslateY(0);
    }
  }, [isOpen]);

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
    startTime.current = Date.now();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startY.current;

    // Only allow dragging downwards
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaY = translateY;
    const timeElapsed = Date.now() - startTime.current;
    const velocity = deltaY / timeElapsed;

    // Close if dragged down more than 100px or fast swipe
    if (deltaY > 100 || (deltaY > 50 && velocity > 0.5)) {
      onClose();
    } else {
      // Snap back
      setTranslateY(0);
    }
  };

  if (!isOpen && translateY === 0) {
    // We can't return null here because we need the overlay to fade out
    // But for now, let's rely on CSS classes for visibility
  }

  return (
    <>
      <div 
        className={`bottom-sheet-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      <div 
        ref={sheetRef}
        className={`bottom-sheet ${isOpen ? 'open' : ''}`}
        style={{ 
          transform: isOpen ? `translateY(${translateY}px)` : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div 
          className="sheet-handle-area"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="sheet-handle"></div>
        </div>
        
        <div className="sheet-header">
          <h3 className="sheet-title">{title}</h3>
        </div>

        <div className="sheet-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
