import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { dataAtom } from '../atoms';
import { supabase } from '../services/supabase';
import { User } from '../types/Users';

export const useUsers = () => {
  const setData = useSetAtom(dataAtom);

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase.from<User>('users').select('*');
    if (data?.length) {
      setData(data);
    }
  }, [setData]);

  useEffect(() => {
    fetchUsers().catch(console.error);

    const mySubscription = supabase
      .from('users')
      .on('*', (payload) => {
        fetchUsers().catch(console.error);
      })
      .subscribe();

    return () => {
      mySubscription.unsubscribe();
    };
  }, [fetchUsers, setData]);
};
