import { useQuery } from '@tanstack/react-query';
import { getGroupsApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';

interface GroupsHookInterface {
  groups: GroupInterface[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const useGroups = (): GroupsHookInterface => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroupsApi(),
    enabled: true, // Включаем автоматическую загрузку
  });

  return {
    groups: data ?? [],
    isLoading,
    error: (error as Error) ?? null,
    refetch,
  };
};

export default useGroups;