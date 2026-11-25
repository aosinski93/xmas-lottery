import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { lotteryRepository } from '../services/supabase';
import type { Family } from '../types/family';
import type { User } from '../types/users';
import type { Utils } from '../types/utils';

type LotteryDataContextValue = {
  users: User[];
  utils: Utils[];
  families: Family[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateUser: (id: number, changes: Partial<User>) => Promise<void>;
  setDrawInProgress: (
    family: number,
    drawInProgress: boolean,
    userDrawing: string | null
  ) => Promise<void>;
  recordDrawResult: (currentUser: User, drawnUser: User) => Promise<void>;
  resetUsers: () => Promise<void>;
  resetUtils: (family: number) => Promise<void>;
};

const LotteryDataContext = createContext<LotteryDataContextValue | null>(null);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Nie udało się pobrać danych';

export const LotteryDataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [utils, setUtils] = useState<Utils[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (operation: () => Promise<void>) => {
    try {
      setError(null);
      await operation();
    } catch (operationError) {
      setError(getErrorMessage(operationError));
      throw operationError;
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [nextUsers, nextUtils, nextFamilies] = await Promise.all([
        lotteryRepository.listUsers(),
        lotteryRepository.listUtils(),
        lotteryRepository.listFamilies(),
      ]);

      setUsers(nextUsers);
      setUtils(nextUtils);
      setFamilies(nextFamilies);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      throw loadError;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTable = useCallback(
    async (table: 'users' | 'utils' | 'families') => {
      try {
        if (table === 'users') {
          setUsers(await lotteryRepository.listUsers());
        } else if (table === 'utils') {
          setUtils(await lotteryRepository.listUtils());
        } else {
          setFamilies(await lotteryRepository.listFamilies());
        }
      } catch (refreshError) {
        setError(getErrorMessage(refreshError));
      }
    },
    []
  );

  useEffect(() => {
    void refresh().catch(() => undefined);

    const subscriptions = [
      lotteryRepository.subscribe('users', () => {
        void refreshTable('users');
      }),
      lotteryRepository.subscribe('utils', () => {
        void refreshTable('utils');
      }),
      lotteryRepository.subscribe('families', () => {
        void refreshTable('families');
      }),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, [refresh, refreshTable]);

  const updateUser = useCallback(
    async (id: number, changes: Partial<User>) =>
      run(async () => {
        await lotteryRepository.updateUser(id, changes);
        await refreshTable('users');
      }),
    [refreshTable, run]
  );

  const setDrawInProgress = useCallback(
    async (
      family: number,
      drawInProgress: boolean,
      userDrawing: string | null
    ) =>
      run(async () => {
        await lotteryRepository.setDrawInProgress(
          family,
          drawInProgress,
          userDrawing
        );
        await refreshTable('utils');
      }),
    [refreshTable, run]
  );

  const recordDrawResult = useCallback(
    async (currentUser: User, drawnUser: User) =>
      run(async () => {
        await lotteryRepository.recordDrawResult(currentUser, drawnUser);
        await refreshTable('users');
      }),
    [refreshTable, run]
  );

  const resetUsers = useCallback(
    async () =>
      run(async () => {
        await lotteryRepository.resetUsers();
        await refreshTable('users');
      }),
    [refreshTable, run]
  );

  const resetUtils = useCallback(
    async (family: number) =>
      run(async () => {
        await lotteryRepository.resetUtils(family);
        await refreshTable('utils');
      }),
    [refreshTable, run]
  );

  const value = useMemo(
    () => ({
      users,
      utils,
      families,
      loading,
      error,
      refresh,
      updateUser,
      setDrawInProgress,
      recordDrawResult,
      resetUsers,
      resetUtils,
    }),
    [
      error,
      families,
      loading,
      recordDrawResult,
      refresh,
      resetUsers,
      resetUtils,
      setDrawInProgress,
      updateUser,
      users,
      utils,
    ]
  );

  return (
    <LotteryDataContext.Provider value={value}>
      {children}
    </LotteryDataContext.Provider>
  );
};

export const useLotteryData = () => {
  const context = useContext(LotteryDataContext);

  if (!context) {
    throw new Error('useLotteryData must be used within LotteryDataProvider');
  }

  return context;
};
