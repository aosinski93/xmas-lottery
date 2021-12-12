import React, { useCallback, useEffect } from 'react';
import { supabase } from './services/supabase';
import { useAtom } from 'jotai';
import { dataAtom, stepAtom } from './atoms';
import { User } from './types/Users';
import { Welcome, Draw, Result } from './components';
import Header from './components/Header';

const App = () => {
  const [step] = useAtom(stepAtom);
  const [, setData] = useAtom(dataAtom);

  const fetchUsers = useCallback(async () => {
    const { data } = await supabase.from<User>('users').select('*');
    if (data?.length) {
      setData(data);
    }
  }, [setData]);

  useEffect(() => {
    fetchUsers().catch(console.error);
  }, [fetchUsers]);

  return (
    <div className={'lg:max-w-lg mx-auto text-center h-screen font-sans'}>
      <Header />
      <Welcome />
      <Draw />
      <Result />
    </div>
  );
};

export default App;
