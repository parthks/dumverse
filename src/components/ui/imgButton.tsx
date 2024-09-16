import { useState } from "react";

export default function ImgButton({
  disabled,
  src,
  onClick,
  alt,
  className,
}: {
  disabled?: boolean;
  src: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  alt: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const buttonDisabled = disabled || isLoading;
  return (
    <button
      disabled={buttonDisabled}
      onClick={async (e) => {
        setIsLoading(true);
        await onClick(e);
        setIsLoading(false);
      }}
      className={`img-button p-0 border-none bg-transparent cursor-pointer transition-transform duration-200 ${
        buttonDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110 active:scale-95"
      } ${className}`}
    >
      <img src={src} alt={alt} className="w-full h-full" />
    </button>
  );
}
