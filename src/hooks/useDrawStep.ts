import { useCallback, useRef, useState } from 'react';

import { useAtom, useAtomValue } from 'jotai';
import { dataAtom, resultAtom, userAtom } from '../atoms';

import useSetDrawResult from '../hooks/useSetDrawResult';
import useSetDrawInProgress from '../hooks/useSetDrawInProgress';

export const useDrawStep = () => {
  const users = useAtomValue(dataAtom);
  const [result, setResult] = useAtom(resultAtom);
  const currentUser = useAtomValue(userAtom);
  const usersToDraw = users.filter((user) => !user.has_been_drawn);
  const wheelRef = useRef<HTMLDivElement>(null);
  const giftsRef = useRef<HTMLDivElement>(null);
  const { setResult: setDrawResult } = useSetDrawResult();
  const { setDrawInProgressFalse: updateUtilsTable } = useSetDrawInProgress();
  const [copySuccess, setCopySuccess] = useState(false);

  const onDrawSuccess = useCallback(
    async (name) => {
      debugger;
      const drawnUser =
        usersToDraw.find((el) => el.first_name === name) ?? null;

      if (drawnUser) {
        setResult(drawnUser);
        setDrawResult(drawnUser);
        await updateUtilsTable();
      }
    },
    [setDrawResult, setResult, updateUtilsTable, usersToDraw]
  );

  // ensure there at least 2 users to draw
  const getUsersToDraw = useCallback(() => {
    const eligibleUsers = users.filter(
      (user) =>
        user.first_name !== currentUser?.first_name &&
        !(currentUser?.excluded_users ?? []).includes(user.id)
    );

    while (eligibleUsers.length < 2) {
      eligibleUsers.push(...eligibleUsers);
    }

    return eligibleUsers;
  }, [currentUser, usersToDraw]);

  const handleCopy = useCallback(() => {
    setCopySuccess(true);
  }, []);

  return {
    wheelRef,
    giftsRef,
    copySuccess,
    handleCopy,
    onDrawSuccess,
    result,
    usersToDraw: getUsersToDraw(),
  };
};
