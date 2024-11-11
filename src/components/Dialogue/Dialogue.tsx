import React, { useState, useEffect, useRef } from 'react';

const GifComponent: React.FC = () => {
  const [showGif, setShowGif] = useState(true);
  const gifUrl = 'https://arweave.net/P4dbRuCalcPDS5pVgHkaPo4xT9MUXqqbzscO9brNpQ4';
  const gifImageRef = useRef<HTMLImageElement>(null);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  useEffect(() => {
    const handleGifEnded = () => {
      if (gifImageRef.current) {
        
        timeoutId = setTimeout(() => {
          setShowGif(false);
        }, 5000);
      }
    };

    if (gifImageRef.current) {
      gifImageRef.current.addEventListener('ended', handleGifEnded);
    }

    return () => {
      if (gifImageRef.current) {
        gifImageRef.current.removeEventListener('ended', handleGifEnded);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div>
      {showGif && (
        <img
          ref={gifImageRef}
          src={gifUrl}
          alt="Animated GIF"
          style={{ maxWidth: '100%' }}
        />
      )}
    </div>
  );
};

export default GifComponent;