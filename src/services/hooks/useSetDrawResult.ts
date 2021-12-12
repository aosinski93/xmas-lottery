import { User } from '../../types/Users';
import { supabase } from '../supabase';

export default function useSetDrawResult() {
  const setResult = (user: User) =>
    supabase
      .from<User>('users')
      .update({
        has_been_drawn: true,
        draw_result: { ...user, has_been_drawn: true },
      })
      .eq('id', user.id);

  return { setResult };
}
