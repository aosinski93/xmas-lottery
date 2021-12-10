import React, { useCallback, useEffect } from 'react';
import { supabase } from './services/supabase';

const App = () => {
  const [data, setData] = React.useState<any>([]);
  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase.from<any>('users').select('*');
    if (error) {

    }
    setData(data);
  }, []);

  useEffect(() => {
    fetchUsers().catch(console.error);
  }, [fetchUsers]);

  console.log(data);

  return (
    <div className={'max-w-md mx-auto text-center h-screen font-sans'}>
      xmas lottery
    </div>
  );
};

export default App;
