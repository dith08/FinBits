import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  color = '#00b894',
  className = 'min-h-[300px]'
}) => (
  <div className={`text-white p-6 rounded-lg border border-gray-800 flex items-center justify-center ${className}`}>
    <Loader2 className="w-8 h-8 animate-spin" style={{ color }} />
  </div>
);
