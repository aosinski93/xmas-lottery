import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAtom } from 'jotai';
import { dataAtom, resultAtom, userAtom } from '../atoms';
import { initializeWheel } from '../services/wheel';
import useSetDrawResult from '../services/hooks/useSetDrawResult';
import useSetDrawInProgress from '../services/hooks/useSetDrawInProgress';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {}

export const Draw = (props: Props) => {
  const [users] = useAtom(dataAtom);
  const [result, setResult] = useAtom(resultAtom);
  const [currentUser] = useAtom(userAtom);
  const usersToDraw = users.filter((el) => !el.has_been_drawn);
  const wheelRef = useRef<HTMLDivElement>(null);
  const giftsRef = useRef<HTMLDivElement>(null);
  const { setResult: setDrawResult } = useSetDrawResult();
  const { setDrawInProgressFalse: updateUtilsTable } = useSetDrawInProgress();
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleCopy = useCallback(() => {
    setCopySuccess(true);
  }, []);

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
      <div
        ref={wheelRef}
        id="wheel"
        className="z-10 shadow-lg rounded-full z-20"
      />
      {result && (
        <CopyToClipboard
          text={result.gift_suggestions.join('\n')}
          onCopy={handleCopy}
        >
          <div className="flex items-center justify-between w-full px-4 cursor-pointer z-20">
            <div
              className={
                'w-full flex flex-col items-center justify-end gap-1 bg-white rounded-3xl p-6 border-2 border-santa-red-light cursor-pointer'
              }
              onClick={handleCopy}
              ref={giftsRef}
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
                  <span className="px-4"> {gift}</span>
                  <img src="/images/giftbox.png" alt="" className="h-4 w-4" />
                </div>
              ))}
              <small className=" mt-3 font-bold text-santa-blue">
                {copySuccess ? 'Skopiowano!' : 'Kliknij żeby skopiować'}
              </small>
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
        </CopyToClipboard>
      )}
    </div>
  );
};
