import { useState, useEffect, useCallback } from 'react';

interface UseFinanceDataOptions<T, R> {
  service: {
    getAll: () => Promise<{ data: R[] }>;
    add: (data: any) => Promise<any>;
    edit: (id: number, data: any) => Promise<any>;
    delete: (id: number) => Promise<any>;
  };
  transform: (item: R) => T;
  idField?: string;
}

interface UseFinanceDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  refresh: () => Promise<void>;
  add: (data: any) => Promise<boolean>;
  update: (id: number, data: any) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
}

export function useFinanceData<T extends { id: number; amount: number }, R>({
  service,
  transform,
}: UseFinanceDataOptions<T, R>): UseFinanceDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await service.getAll();
      const transformed = (response.data || []).map(transform);
      setData(transformed);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [service, transform]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = async (newData: any): Promise<boolean> => {
    try {
      await service.add(newData);
      await fetchData();
      return true;
    } catch (err: any) {
      console.error('Error adding:', err);
      alert(err.response?.data?.message || 'Gagal menambah data');
      return false;
    }
  };

  const update = async (id: number, updateData: any): Promise<boolean> => {
    try {
      await service.edit(id, updateData);
      await fetchData();
      return true;
    } catch (err: any) {
      console.error('Error updating:', err);
      alert(err.response?.data?.message || 'Gagal mengupdate data');
      return false;
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      await service.delete(id);
      await fetchData();
      return true;
    } catch (err: any) {
      console.error('Error deleting:', err);
      alert(err.response?.data?.message || 'Gagal menghapus data');
      return false;
    }
  };

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return {
    data,
    loading,
    error,
    total,
    refresh: fetchData,
    add,
    update,
    remove,
  };
}
