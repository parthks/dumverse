import React, { useState, useEffect } from 'react';

interface GifComponentProps {
  
  className?: string;
}

const GifComponent: React.FC<GifComponentProps> = ({ className }) => {
  const [showButton, setShowButton] = useState(false);
  const [gifSrc, setGifSrc] = useState("");

  useEffect(() => {
  
    setGifSrc(`https://arweave.net/OeQKQOi4B6VG4IG9xPYrHgrJooWyvazHl9KvY5a1KO0?${Date.now()}`);

    if (gifSrc){
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 3000);
  
      return () => clearTimeout(timer); 
    }
 
  }, [gifSrc]); 

  return (
    <div className={`relative ${className}`}>
      {gifSrc && (
        <img
          src={gifSrc}
          alt="Dialogue Quest GIF"
          className="relative max-w-full"
        />
      )}
      {showButton && (
        <button
          className="absolute top-[55%] right-[45%] bg-gray-800 text-white px-4 py-2 rounded-md"
          onClick={() => alert('Quest Started!')}
        >
          Quest
        </button>
      )}
    </div>
  );
};

export default GifComponent;
