import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAtom, useAtomValue } from 'jotai';
import { resultAtom, userAtom } from '../atoms';
import { initializeWheel } from '../services/wheel';
import useSetDrawResult from './use-set-draw-result';
import useSetDrawInProgress from './use-set-draw-in-progress';
import { createWheelEntries } from '../lib/lottery';
import { useFamilyId } from './use-family-id';
import { useLotteryData } from '../contexts/lottery-data-context';

export const useDrawStep = () => {
  const familyId = Number(useFamilyId());
  const { users: allUsers } = useLotteryData();
  const users = allUsers.filter((user) => user.family === familyId);
  const [result, setResult] = useAtom(resultAtom);
  const currentUser = useAtomValue(userAtom);
  const usersToDraw = useMemo(
    () => users.filter((user) => !user.has_been_drawn),
    [users],
  );
  const wheelEntries = useMemo(
    () => createWheelEntries(usersToDraw, currentUser),
    [currentUser, usersToDraw],
  );

  const wheelRef = useRef<HTMLDivElement>(null);
  const { setResult: setDrawResult } = useSetDrawResult();
  const { setDrawInProgressFalse: updateUtilsTable } = useSetDrawInProgress();
  const [copySuccess, setCopySuccess] = useState(false);

  const draw = useCallback(
    async ({ text }: { text: string; chance: number }) => {
      const drawnUser =
        usersToDraw.find((el) => el.first_name === text) ?? null;

      if (drawnUser) {
        setResult(drawnUser);
        await setDrawResult(drawnUser);
        await updateUtilsTable();
      }
    },
    [setDrawResult, setResult, updateUtilsTable, usersToDraw],
  );

  const handleCopy = useCallback(async () => {
    const text = result?.gift_suggestions?.join(', ') ?? '';

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
    } catch (error) {
      console.error('Unable to copy gift suggestions', error);
    }
  }, [result]);

  useEffect(() => {
    if (wheelRef.current?.children?.length === 0 && wheelEntries?.length > 0) {
      initializeWheel({
        data: wheelEntries,
        config: {
          onSuccess: draw,
        },
      });
    }
  }, [draw, wheelEntries]);

  return {
    wheelRef,
    copySuccess,
    handleCopy,
    result,
    hasCandidates: wheelEntries?.length > 0,
  };
};
