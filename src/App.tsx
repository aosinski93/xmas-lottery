import { useAtomValue } from 'jotai';
import { stepAtom } from './atoms';
import { Welcome, Draw, Header } from './components';
import { useUsers } from './hooks/useUsers';

type Steps = {
  [key: number]: JSX.Element;
};

const steps: Steps = {
  1: <Welcome />,
  2: <Draw />,
};

const App = () => {
  const step = useAtomValue(stepAtom);
  useUsers();

  return (
    <div
      className={
        'flex flex-col max-w-lg mx-auto text-center h-screen font-sans'
      }
    >
      <Header />
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
