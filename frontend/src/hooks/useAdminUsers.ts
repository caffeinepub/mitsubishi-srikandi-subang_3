import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { AdminUser, UserRole } from '../backend';
import { protectedCall } from '../utils/apiClient';

export function useGetAllAdminUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminUser[]>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdminUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAdminUser() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      role,
    }: {
      name: string;
      email: string;
      role: UserRole;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, () =>
        actor.createAdminUser(name, email, role)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

export function useUpdateAdminUser() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: AdminUser) => {
      if (!actor) throw new Error('Actor not initialized');
      const principalId = identity?.getPrincipal().toString();
      // Note: backend doesn't have updateAdminUser yet, stub for future
      return protectedCall(principalId, async () => {
        throw new Error('updateAdminUser not yet implemented in backend');
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

export function useDeleteAdminUser() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const callerPrincipalId = identity?.getPrincipal().toString();
      // Note: backend doesn't have deleteAdminUser yet, stub for future
      return protectedCall(callerPrincipalId, async () => {
        throw new Error('deleteAdminUser not yet implemented in backend');
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}
