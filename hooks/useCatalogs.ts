'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface CatalogItem {
  id: string;
  category: string;
  name: string;
  code: string;
  is_active: boolean;
  order: number;
  metadata?: any;
}

export const useCatalogs = (category: string) => {
  return useQuery({
    queryKey: ['catalogs', category],
    queryFn: async () => {
      const { data } = await api.get<CatalogItem[]>(`/catalogs?category=${category}`);
      return data;
    },
    staleTime: Infinity, 
    select: (data) => data.filter(item => item.is_active).sort((a, b) => a.order - b.order),
  });
};
