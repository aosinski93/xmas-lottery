import { supabase } from '../services/supabase';

export default function useSetDrawResult() {
  const setDrawInProgressTrue = async (username?: string) => {
    try {
      await supabase
        .from('utils')
        .update({
          draw_in_progress: true,
          user_drawing: username,
        })
        .eq('id', '1');
    } catch (error) {
      console.log(error);
    }
  };

  const setDrawInProgressFalse = async () => {
    try {
      await supabase
        .from('utils')
        .update({
          draw_in_progress: false,
          user_drawing: null,
        })
        .eq('id', '1');
    } catch (error) {
      console.log(error);
    }
  };

  return { setDrawInProgressTrue, setDrawInProgressFalse };
}
