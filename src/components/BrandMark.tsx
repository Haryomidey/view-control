interface BrandMarkProps {
  className?: string;
  size?: number;
}

export const BrandMark = ({ className = 'text-black', size = 24 }: BrandMarkProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M3 9h18" />
    </svg>
  );
};
