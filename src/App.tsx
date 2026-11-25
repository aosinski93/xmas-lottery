import { useAtomValue } from 'jotai';
import { stepAtom } from './atoms';
import { Welcome, Draw, Header } from './components';
import { useLotteryData } from './contexts/lottery-data-context';

type Steps = {
  [key: number]: JSX.Element;
};

const steps: Steps = {
  1: <Welcome />,
  2: <Draw />,
};

const App = () => {
  const step = useAtomValue(stepAtom);
  const { error, refresh } = useLotteryData();

  return (
    <div
      className={
        'flex flex-col max-w-lg mx-auto text-center h-screen font-sans'
      }
    >
      <Header />
      {error && (
        <div className="bg-white p-4 text-red-500" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="underline"
            onClick={() => void refresh().catch(console.error)}
          >
            Spróbuj ponownie
          </button>
        </div>
      )}
      {steps[step]}
      <img
        src="/images/santa-trees.png"
        alt=""
        className="fixed bottom-0 sm:max-w-lg xl:max-w-xl"
      />
    </div>
  );
};

export default App;
