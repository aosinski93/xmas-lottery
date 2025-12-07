import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { usersAtom } from '../atoms';
import { supabase } from '../services/supabase';
import { User } from '../types/Users';

export const useUsers = () => {
  const setData = useSetAtom(usersAtom);
  const params = new URLSearchParams(window.location.search);
  let familyId = params.get('family') ?? '';

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase
      .from<User>('users')
      .select('*')
      .eq('family', familyId);
    if (data?.length) {
      setData(data);
    }
  }, [setData, familyId]);

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
