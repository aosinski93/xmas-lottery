import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { stepAtom, usersAtom, userAtom } from '../atoms';
import { supabase } from '../services/supabase';
import { Utils } from '../types/Utils';
import useSetDrawInProgress from './useSetDrawInProgress';
import { User } from '../types/Users';
import { useFamilyId } from './useFamilyId';

export const useWelcomeStep = () => {
  const familyId = useFamilyId();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setStep = useSetAtom(stepAtom);
  const users: User[] = useAtomValue(usersAtom);
  const [currentUser, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [drawInProgress, setDrawInProgress] = useState(false);
  const [drawingUser, setDrawingUser] = useState<string | null>(null);

  const { setDrawInProgressTrue } = useSetDrawInProgress();

  const fetchUtils = useCallback(async () => {
    const { data } = await supabase
      .from<Utils>('utils')
      .select('*')
      .eq('family', familyId);

    if (data?.length) {
      setDrawInProgress(data[0].draw_in_progress);
      setDrawingUser(data[0].user_drawing);
    }
  }, []);

  useEffect(() => {
    fetchUtils();

    const mySubscription = supabase
      .from<Utils>('utils')
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
    setDrawInProgressTrue(user.first_name);
    setDropdownOpen(false);

    setTimeout(() => {
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
    users,
    loading,
    loadingText,
    drawInProgress,
    drawingUser,
    toggleDropdown,
    handleSetUser,
  };
};
