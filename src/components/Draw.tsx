import React, { useState } from 'react';

import { useAtom } from 'jotai';
import { dataAtom, stepAtom } from '../atoms';

import { Ball } from './Ball';

interface Props {}

export const Draw = (props: Props) => {
  const [users] = useAtom(dataAtom);
  const [, setStep] = useAtom(stepAtom);
  const [userDrawn, setUserDrawn] = useState(false);
  const [numberBall, setNumberBall] = useState(1);
  const usersToDraw = users.filter((el) => !el.has_been_drawn);
  const numOfBalls = Array.apply(null, Array(usersToDraw.length)).map(
    (x, i) => i
  );

  const draw = () => {
    const randomNum = Math.floor(Math.random() * usersToDraw.length);
    setNumberBall(randomNum + 1);
    setTimeout(() => {
      setUserDrawn(true);
    }, 1000);

    return usersToDraw[randomNum];
  };

  return (
    <div className={'flex flex-col items-center gap-4 bg-background-color-snow pt-6'}>
      <div className={'w-64 h-64 rounded-full border-2 border-gray'}>
        {/* {numOfBalls.map((el) => (
          <Ball
            num={el}
            key={el}
            isHidden={el === numberBall - 1 && userDrawn}
          />
        ))} */}
      </div>
      <button
        className="py-2 px-6 rounded-full bg-balls-4 text-sm font-mono font-extrabold tracking-wider text-white"
        onClick={draw}
      >
        LOSUJ
      </button>
      {userDrawn && (
        <div className='flex items-center justify-between w-full px-4'>
          <img src='/images/giftbox.png' alt='' className='h-14 w-14' />
          <div className={'h-36 w-36 px-2 flex flex-col items-center justify-end gap-1 bg-background-gift bg-center bg-contain bg-no-repeat'}>
            <div
              onClick={() => {
                setStep(3);
              }}
              className="flex justify-center items-center w-12 h-12 rounded-full bg-balls-4 text-sm font-mono font-extrabold text-white"
            >
              {numberBall}
            </div>
            <span className='text-xs font-mono font-bold tracking-wider text-balls-4 py-3'> KLIKNIJ WE MNIE</span>
          </div>
          <img src='/images/giftbox.png' alt='' className='h-14 w-14' />
        </div>
      )}
      <img src='/images/santa-trees.png' alt='' />
    </div>
  );
};
