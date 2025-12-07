import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from './credentials';
import { Utils } from '../types/Utils';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const resetUsersTable = async (): Promise<string> => {
  try {
    await supabase
      .from('users')
      .update({
        has_been_drawn: false,
        already_drew: false,
        draw_result: null,
      })
      .lt('created_at', new Date().toISOString());

    return 'success';
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

export const resetUtilsTable = async (family: number): Promise<string> => {
  try {
    await supabase
      .from<Utils>('utils')
      .update({
        draw_in_progress: false,
        user_drawing: null as any,
      })
      .eq('family', family);

    return 'success';
  } catch (error) {
    console.log(error);
    return 'error';
  }
};
