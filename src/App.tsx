import { useCallback, useEffect } from 'react';
import { supabase } from './services/supabase';
import { useAtom, useSetAtom } from 'jotai';
import { dataAtom, stepAtom } from './atoms';
import { User } from './types/Users';
import { Welcome, Draw } from './components';
import Header from './components/Header';


// uncomment and run once to reset the app
// const resetApp = async (users: User[]) => {
//   await supabase
//     .from<User>('users')
//     .update({
//       already_drew: false,
//       gift_suggestions: [],
//       draw_result: null,
//       has_been_drawn: false,
//     })
//     .in(
//       'id',
//       users.map((user) => user.id)
//     );
// };

const App = () => {
  const [step] = useAtom(stepAtom);
  const setData = useSetAtom(dataAtom);

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase.from<User>('users').select('*');
    if (data?.length) {
      setData(data);
    }
  }, [setData]);

  useEffect(() => {
    fetchUsers().catch(console.error);

    const mySubscription = supabase
      .from('users')
      .on('*', (payload) => {
        fetchUsers().catch(console.error);
      })
      .subscribe();

    return () => {
      mySubscription.unsubscribe();
    };
  }, [fetchUsers, setData]);

  return (
    <div
      className={
        'flex flex-col max-w-lg mx-auto text-center h-screen font-sans'
      }
    >
      <Header />
      {step === 1 && <Welcome />}
      {step === 2 && <Draw />}
      <img
        src="/images/santa-trees.png"
        alt=""
        className="fixed bottom-0 sm:max-w-lg xl:max-w-xl"
      />
    </div>
  );
};

export default App;
