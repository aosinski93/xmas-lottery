import Wheel from 'lottery-wheel';

export interface InitializeWheelParams {
  data: number[];
  config?: {
    onSuccess?: (data: any) => void;
    onFail?: () => void;
    buttonText?: string;
  };

  [key: string]: any;
}

export const initializeWheel = ({ data, config }: InitializeWheelParams) => {
  console.log(config);

  return new Wheel({
    el: document.getElementById('wheel'),
    data: [
      'Adam',
      'John',
      'Jane',
      'John',
      'Adam',
      'Adam',
      'John',
      'Jane',
      'John',
      'Adam',
      'Adam',
    ],
    buttonText: 'Losuj',
    radius: 200,
    ...config,
  });
};
