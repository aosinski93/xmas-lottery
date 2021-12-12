import React, { useCallback, useEffect, useRef } from 'react';

import { useAtom } from 'jotai';
import { dataAtom, resultAtom, stepAtom, userAtom } from '../atoms';
import { initializeWheel } from '../services/wheel';
import useSetDrawResult from '../services/hooks/useSetDrawResult';
import useSetDrawInProgress from '../services/hooks/useSetDrawInProgress';

interface Props {}

export const Draw = (props: Props) => {
  const [users] = useAtom(dataAtom);
  const [, setStep] = useAtom(stepAtom);
  const [result, setResult] = useAtom(resultAtom);
  const [currentUser] = useAtom(userAtom);
  const usersToDraw = users.filter((el) => !el.has_been_drawn);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { setResult: setDrawResult } = useSetDrawResult();
  const { setDrawInProgressFalse: updateUtilsTable } = useSetDrawInProgress();

  const draw = useCallback(
    ({ text }: { text: string; chance: number }) => {
      const drawnUser =
        usersToDraw.find((el) => el.first_name === text) || null;
      console.log(drawnUser);

      if (drawnUser) {
        setResult(drawnUser);
        setDrawResult(drawnUser);
        updateUtilsTable();
      }
    },
    [setDrawResult, setResult, updateUtilsTable, usersToDraw]
  );

  useEffect(() => {
    if (wheelRef.current?.children.length === 0) {
      const data = usersToDraw
        .filter((user) => user.first_name !== currentUser?.first_name)
        .map((user) => ({ text: user.first_name }));

      while (data.length < 3) {
        data.push(...data);
      }

      initializeWheel({
        data,
        config: {
          onSuccess: draw,
        },
      });
    }
  }, [currentUser?.first_name, draw, usersToDraw]);

  return (
    <div className={'flex flex-col items-center gap-4 pt-6'}>
      <div ref={wheelRef} id="wheel" />
      {result && (
        <div className="flex items-center justify-between w-full px-4">
          <img src="/images/giftbox.png" alt="" className="h-14 w-14" />
          <div
            className={
              'h-36 w-36 px-2 flex flex-col items-center justify-end gap-1 bg-background-gift bg-center bg-contain bg-no-repeat cursor-pointer'
            }
            onClick={() => {
              setStep(3);
            }}
          >
            <div className="flex justify-center items-center w-12 h-12 rounded-full bg-balls-4 text-sm font-mono font-extrabold text-white">
              {result?.first_name}
            </div>
            <span className="text-xs font-mono font-bold tracking-wider text-balls-4 py-3">
              Pokaż propozycje
            </span>
          </div>
          <img src="/images/giftbox.png" alt="" className="h-14 w-14" />
        </div>
      )}
      <img src="/images/santa-trees.png" alt="" />
    </div>
  );
};
