import Wheel from 'lottery-wheel';

interface DataObject {
  text: string;
  chance?: number;
}
export interface InitializeWheelParams {
  data: DataObject[];
  config?: {
    onSuccess?: (data: any) => void;
    onFail?: () => void;
    buttonText?: string;
  };

  [key: string]: any;
}

export const initializeWheel = ({ data, config }: InitializeWheelParams) => {
  return new Wheel({
    el: document.getElementById('wheel'),
    data,
    buttonText: 'Losuj',
    radius: 175,
    limit: 1,
    duration: 2000,
    onFail: () => {
      alert('Mozesz wylosować tylko jeden raz');
    },
    ...config,
    color: {
      border: '#FFFFFF',
      line: '#FFFFFF',
      prize: '#F68080',
      button: '#E56161',
      prizeFont: '#FFFFFF',
      buttonFont: '#black-enough'
    }
  });
};
