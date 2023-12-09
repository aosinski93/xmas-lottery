import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { stepAtom, dataAtom, userAtom } from '../atoms';
import { supabase } from '../services/supabase';
import { Utils } from '../types/Utils';
import useSetDrawInProgress from './useSetDrawInProgress';
import { User } from '../types/Users';

export const useWelcomeStep = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setStep = useSetAtom(stepAtom);
  const data = useAtomValue(dataAtom);
  const [currentUser, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [drawInProgress, setDrawInProgress] = useState(true);
  const [drawingUser, setDrawingUser] = useState<string | null>(null);

  const { setDrawInProgressTrue: updateUtilsTable } = useSetDrawInProgress();

  const fetchUtils = useCallback(async () => {
    const { data } = await supabase.from<Utils>('utils').select('*');
    if (data?.length) {
      setDrawInProgress(data[0].draw_in_progress);
      setDrawingUser(data[0].user_drawing);
    }
  }, []);

  useEffect(() => {
    fetchUtils();

    const mySubscription = supabase
      .from('utils')
      .on('*', (payload) => {
        setDrawInProgress(payload.new.draw_in_progress);
        setDrawingUser(payload.new.user_drawing);
      })
      .subscribe();

    return () => {
      mySubscription.unsubscribe();
    };
  }, [fetchUtils]);

  const handleSetUser = async (user: User) => {
    const timeout = Math.random() * 5000 + 1;
    setLoading(true);
    setUser(user);
    setTimeout(async () => {
      await updateUtilsTable(user.first_name);
      setDropdownOpen(false);
      setStep(2);
      setLoading(false);
    }, timeout);
  };

  const isFemale = useMemo(() => {
    return (
      currentUser?.first_name.charAt(currentUser.first_name.length - 1) === 'a'
    );
  }, [currentUser]);

  const loadingText = `Poczekaj, sprawdzamy czy ${
    isFemale ? 'byłaś' : 'byłeś'
  } ${isFemale ? 'grzeczna' : 'grzeczny'}...`;

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return {
    dropdownOpen,
    data,
    loading,
    loadingText,
    drawInProgress,
    drawingUser,
    toggleDropdown,
    handleSetUser,
  };
};
