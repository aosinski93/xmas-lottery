import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { dataAtom, userAtom } from '../atoms';
import { supabase } from '../services/supabase';
import { User } from '../types/Users';

export const useUsers = () => {
  const setData = useSetAtom(dataAtom);
  const currentUser = useAtomValue(userAtom);

  const fetchUsers = useCallback(async () => {
    if (currentUser) {
      const { data } = await supabase
        .from<User>('users')
        .select('*')
        .eq('family', currentUser?.family)
        .neq('id', currentUser.id);

      if (data) {
        setData(data);
      }
    } else {
      const { data } = await supabase.from<User>('users').select('*');
      if (data) {
        setData(data);
      }
    }
  }, [setData, currentUser]);

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
