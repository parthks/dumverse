import React, { useState, useRef, useEffect } from 'react';

interface VolumeSliderProps {
  onChange?: (volume: number) => void;
  initialVolume?: number;
  className?: string;
  title: string
}

export default function VolumeSlider({ onChange, initialVolume = 0.5, className, title }: VolumeSliderProps) {
  const [volume, setVolume] = useState(initialVolume);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateVolume(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateVolume(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateVolume = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const thumbWidth = 24; // Width of the thumb
      const padding = thumbWidth / 2;
      
      // Adjust the available width to account for padding
      const availableWidth = rect.width - (padding * 2);
      
      // Adjust x position to account for padding
      const x = clientX - rect.left - padding;
      
      // Calculate volume with padding considered
      const newVolume = Math.max(0, Math.min(1, x / availableWidth));
      setVolume(newVolume);
      onChange?.(newVolume);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`${className} flex items-center gap-3`}>
      <div 
        ref={sliderRef}
        className="relative w-[200px] h-[24px] cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Slider background */}
        <img 
          src="https://arweave.net/sBI2f6GO8LpbUKvPemydlpk4NGuUY0ZhF__uATOXSVQ"
          alt="Volume slider background"
          className="w-full h-full object-cover"
        />
        
        {/* Slider thumb */}
        <div 
          className="absolute top-1/2"
          style={{
            left: `calc(15px + (100% - 36px) * ${volume})`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <img 
            src="https://arweave.net/N2puSemjdoiFC7gH_5pVSLhw7VMdX7t_5j5QBZAXEgw"
            alt="Volume slider thumb"
            className="w-[24px] h-[24px] object-contain"
            draggable={false}
          />
        </div>

        {/* Volume percentage display */}
        <div className="absolute w-full text-center mt-2 text-black font-bold">
          {Math.round(volume * 100)}%
        </div>
      </div>

      {/* speaker icon */}
      <img 
        src="https://arweave.net/49rtLYM08rPlYUWVFYvMYa7nakoEfWR63oPIDkXSB58"
        alt="Speaker icon"
        className="w-[24px] h-[24px] object-contain"
        draggable={false}
      />

      {/* Title */}
      <div className="w-[50px] text-2xl text-center text-black font-bold">
        {title}
      </div>
    </div>
  );
}
