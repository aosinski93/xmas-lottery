import { useSetAtom, useAtom } from 'jotai';
import { useState, useMemo } from 'react';
import { stepAtom, userAtom } from '../atoms';
import useSetDrawInProgress from './use-set-draw-in-progress';
import { User } from '../types/users';
import { useFamilyId } from './use-family-id';
import { useLotteryData } from '../contexts/lottery-data-context';

export const useWelcomeStep = () => {
  const familyId = useFamilyId();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setStep = useSetAtom(stepAtom);
  const { users: allUsers, utils, loading: dataLoading } = useLotteryData();
  const users = allUsers.filter((user) => user.family === Number(familyId));
  const familyUtils = utils.find((item) => item.family === Number(familyId));
  const [currentUser, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);

  const { setDrawInProgressTrue } = useSetDrawInProgress();

  const handleSetUser = async (user: User) => {
    const timeout = Math.random() * 5000 + 1;
    setLoading(true);
    setUser(user);
    try {
      await setDrawInProgressTrue(user.first_name);
      setDropdownOpen(false);

      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, timeout);
    } catch {
      setLoading(false);
    }
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
    loading: loading || dataLoading,
    loadingText,
    drawInProgress: familyUtils?.draw_in_progress ?? false,
    drawingUser: familyUtils?.user_drawing ?? null,
    toggleDropdown,
    handleSetUser,
  };
};
