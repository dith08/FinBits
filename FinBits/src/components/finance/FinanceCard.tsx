import React, { useState } from 'react';
import { LoadingSpinner, ErrorMessage } from '../common';

export interface FinanceItem {
  id: number;
  label: string;
  value: string;
  amount: number;
  date: string;
  source: string;
  category?: string;
  description?: string;
  notes?: string;
}

interface FinanceCardProps {
  title: string;
  color: string;
  data: FinanceItem[];
  total: number;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAdd: (data: any) => Promise<boolean>;
  onUpdate: (id: number, data: any) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  AddModal: React.ComponentType<{ onClose: () => void; onAdd: (...args: any[]) => void }>;
  DetailModal: React.ComponentType<{
    onClose: () => void;
    items: FinanceItem[];
    onDelete: (id: number) => void;
    onUpdate: (id: number, data: any) => void;
  }>;
}

export const FinanceCard: React.FC<FinanceCardProps> = ({
  title,
  color,
  data,
  total,
  loading,
  error,
  onRefresh,
  onAdd,
  onUpdate,
  onDelete,
  AddModal,
  DetailModal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  if (loading) {
    return <LoadingSpinner color={color} />;
  }

  return (
    <div className="text-white p-6 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-4" style={{ color }}>{title}</h2>
      
      {error && <ErrorMessage message={error} onRetry={onRefresh} />}
      
      <div className="space-y-3 mb-6">
        {data.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Belum ada data {title.toLowerCase()}</p>
        ) : (
          <>
            {data.slice(0, 6).map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{item.label} :</span>
                <span className="font-semibold" style={{ color }}>{item.value}</span>
              </div>
            ))}
            {data.length > 6 && (
              <div className="text-gray-400 text-sm text-center">
                +{data.length - 6} more items...
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-6">
        <span className="font-semibold">Total :</span>
        <span className="text-lg font-bold" style={{ color }}>
          Rp {total.toLocaleString('id-ID')}
        </span>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex-1 py-2 px-3 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
          style={{ '--hover-border': color } as React.CSSProperties}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#4b5563'}
        >
          Add {title}
        </button>
        <button 
          onClick={() => setShowDetailModal(true)}
          className="flex-1 py-2 px-3 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
          onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#4b5563'}
        >
          Detail
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50">
          <AddModal 
            onClose={() => setShowAddModal(false)}
            onAdd={async (...args: any[]) => {
              const success = await onAdd(args);
              if (success) setShowAddModal(false);
            }}
          />
        </div>
      )}

      {showDetailModal && (
        <div className="fixed inset-0 z-50">
          <DetailModal
            onClose={() => setShowDetailModal(false)}
            items={data}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
};
