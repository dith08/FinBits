interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
    {message}
    {onRetry && (
      <button onClick={onRetry} className="ml-2 underline">
        Coba lagi
      </button>
    )}
  </div>
);
