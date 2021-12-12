import React from 'react';

interface Props {
  num: number;
  isHidden: boolean;
}

export const Ball = (props: Props) => (
  <div
    className={`flex justify-center items-center w-8 h-8 rounded-full bg-ball-1 ${
      props.isHidden ? 'invisible' : 'visible'
    }`}
  >
    <div className="w-4 h-4 rounded-full bg-white text-ball-1 text-xs">
      {props.num + 1}
    </div>
  </div>
);
