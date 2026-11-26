import { useSetAtom, useAtom } from 'jotai';
import { useState, useMemo } from 'react';
import { stepAtom, StepName, userAtom } from '../atoms';
import { User } from '../types/users';
import { useFamilyId } from './use-family-id';
import { useLotteryData } from '../contexts/lottery-data-context';

export const useWelcomeStep = () => {
  const familyId = useFamilyId();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setStep = useSetAtom(stepAtom);
  const { users: allUsers, utils, loading: dataLoading } = useLotteryData();
  const currentFamilyUsers = allUsers.filter(
    (user) => user.family === Number(familyId),
  );
  const familyUtils = utils.find((item) => item.family === Number(familyId));
  const [currentUser, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const usersWithoutGiftSuggestions = currentFamilyUsers.filter(
    (user) => !user.gift_suggestions?.length,
  );

  const hasUsersWithoutGiftSuggestions = usersWithoutGiftSuggestions.length > 0;

  const handleSetUser = (user: User) => {
    if (!user.gift_suggestions.length) {
      setUser(user);
      setDropdownOpen(false);
      return setStep(StepName.gift_entry);
    }

    const timeout = Math.random() * 5000 + 1;
    setLoading(true);
    setUser(user);
    setTimeout(() => {
      setLoading(false);
      setStep(StepName.draw);
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
    users: hasUsersWithoutGiftSuggestions
      ? usersWithoutGiftSuggestions
      : currentFamilyUsers,
    hasUsersWithoutGiftSuggestions,
    loading: loading || dataLoading,
    loadingText,
    drawInProgress: familyUtils?.draw_in_progress ?? false,
    drawingUser: familyUtils?.user_drawing ?? null,
    toggleDropdown,
    handleSetUser,
  };
};
