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
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`p-0 border-none bg-transparent cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 ${
        disabled ? "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100" : ""
      } ${className}`}
    >
      <img src={src} alt={alt} className="w-full h-full" />
    </button>
  );
}
