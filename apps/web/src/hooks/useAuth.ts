import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'HSE_OFFICER' | 'FIELD_SUPERVISOR' | 'ADMIN';
}

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data.data;
      } catch (err: any) {
        // Return null for 401 Unauthorized or network errors (like server down)
        // so the app falls back to the login page gracefully instead of crashing
        console.error('Auth check failed:', err);
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await api.post('/auth/login', credentials);
      return res.data.data.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['me'], userData);
      router.push('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      router.push('/login');
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
  };
}
