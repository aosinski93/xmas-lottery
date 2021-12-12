import React, { useEffect, useRef, useState } from 'react';

import { useAtom } from 'jotai';
import { dataAtom, stepAtom } from '../atoms';
import { Ball } from './Ball';
import { initializeWheel } from '../services/wheel';

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
  const wheelRef = useRef<HTMLDivElement>(null);

  const draw = () => {
    const randomNum = Math.floor(Math.random() * usersToDraw.length);
    setNumberBall(randomNum + 1);
    setTimeout(() => {
      setUserDrawn(true);
    }, 1000);

    return usersToDraw[randomNum];
  };

  useEffect(() => {
    if (numOfBalls.length > 3 && wheelRef.current?.children.length === 0) {
      initializeWheel({
        data: numOfBalls,
        config: {
          onSuccess: (data) => console.log(data),
        },
      });
    }
  }, [numOfBalls]);

  return (
    <div className={'flex flex-col items-center gap-4'}>
      <div ref={wheelRef} id="wheel"></div>
    </div>
  );
};
