import { useCallback, useEffect, useRef, useState } from 'react';

import { useAtom, useAtomValue } from 'jotai';
import { dataAtom, resultAtom, userAtom } from '../atoms';
import { initializeWheel } from '../services/wheel';
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

  const draw = useCallback(
    async ({ text }: { text: string; chance: number }) => {
      const drawnUser =
        usersToDraw.find((el) => el.first_name === text) ?? null;

      if (drawnUser) {
        setResult(drawnUser);
        setDrawResult(drawnUser);
        await updateUtilsTable();
      }
    },
    [setDrawResult, setResult, updateUtilsTable, usersToDraw]
  );

  const handleCopy = useCallback(() => {
    setCopySuccess(true);
  }, []);

  useEffect(() => {
    if (wheelRef.current?.children.length === 0) {
      let data = usersToDraw
        .filter(
          (user) =>
            user.first_name !== currentUser?.first_name &&
            !(currentUser?.excluded_users ?? []).includes(user.id)
        )
        .map((user) => ({ text: user.first_name }));

      while (data.length < 3) {
        data.push(...data);
      }

      if (data.length > 12) {
        data = data.slice(0, 11);
      }

      initializeWheel({
        data,
        config: {
          onSuccess: draw,
        },
      });
    }
  }, [currentUser, draw, usersToDraw]);

  return {
    wheelRef,
    giftsRef,
    copySuccess,
    handleCopy,
    result,
  };
};
