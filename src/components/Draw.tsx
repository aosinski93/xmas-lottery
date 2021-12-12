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
    <div
      className={
        'flex flex-col flex-auto items-center gap-4 bg-background-color-snow pt-6'
      }
    >
      <div ref={wheelRef} id="wheel" className="z-10 shadow-lg rounded-full" />
      {result && (
        <div className="flex items-center justify-between w-full px-4 z-10">
          <div
            className={
              'w-full flex flex-col items-center justify-end gap-1 bg-white rounded-3xl p-6 border-2 border-santa-red-light'
            }
          >
            <div className="flex justify-center items-center p-6 h-12 rounded-full bg-santa-blue text-sm font-extrabold text-black-enough">
              {result?.first_name}
            </div>
            <span className="text-sm text-black-enough font-semibold pb-2 pt-4">
              Propozycje prezentowe:
            </span>
            {result.gift_suggestions?.map((gift) => (
              <div
                key={gift}
                className="flex items-center justify-between text-sm text-black-enough"
              >
                <img src="/images/giftbox.png" alt="" className="h-4 w-4" />
                <span className="px-2"> {gift}</span>
                <img src="/images/giftbox.png" alt="" className="h-4 w-4" />
              </div>
            ))}
            {!result.gift_suggestions && (
              <div className="flex items-center justify-between text-sm text-black-enough">
                <img src="/images/giftbox.png" alt="" className="h-4 w-4" />
                <span className="px-2">rózga</span>
                <img src="/images/giftbox.png" alt="" className="h-4 w-4" />
                <span className="px-2">
                  (bo nie zostały przekazane propozycje)
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <img
        src="/images/santa-trees.png"
        alt=""
        className="fixed bottom-0 lg:max-w-lg"
      />
    </div>
  );
};
