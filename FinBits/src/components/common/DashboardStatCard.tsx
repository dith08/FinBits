import type { ReactNode } from 'react';

interface DashboardStatCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  loading,
  children,
}) => {
  if (loading) {
    return (
      <div className="bg-[#181818] p-6 rounded-2xl flex flex-col items-center justify-center w-82 h-82 border border-gray-800">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] p-6 rounded-2xl flex flex-col items-center justify-between w-82 h-82 border border-gray-800">
      <h3 className="text-white font-bold text-lg text-center">{title}</h3>
      
      {children ? (
        children
      ) : (
        <>
          {icon && (
            <div className="text-[#10b981] flex items-center justify-center">
              {icon}
            </div>
          )}
          {value !== undefined && (
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-[#10b981] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{value}</span>
              </div>
            </div>
          )}
        </>
      )}

      {subtitle && (
        <p className="text-gray-500 text-sm font-medium text-center">{subtitle}</p>
      )}
    </div>
  );
};
