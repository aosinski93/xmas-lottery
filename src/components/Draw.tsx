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
    <div className={'flex flex-col items-center gap-4'}>
      <div className={'w-64 h-64 rounded-full border-2 border-gray'}>
        {numOfBalls.map((el) => (
          <Ball
            num={el}
            key={el}
            isHidden={el === numberBall - 1 && userDrawn}
          />
        ))}
      </div>
      <button
        className="py-2 px-6 rounded-full bg-red-600 text-white"
        onClick={draw}
      >
        Losuj
      </button>
      {userDrawn && (
        <div className={'flex flex-col items-center gap-1'}>
          <div
            onClick={() => {
              setStep(3);
            }}
            className="flex justify-center items-center w-12 h-12 rounded-full bg-ball-1"
          >
            <div className="w-6 h-6 rounded-full bg-white text-ball-1 text-xs leading-6">
              {numberBall}
            </div>
          </div>
          <span className="text-red-600"> Kliknij we mnie </span>
        </div>
      )}
    </div>
  );
};
