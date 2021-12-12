import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { User } from '../../types/Users';
import { supabase } from '../supabase';

export default function useSetDrawResult() {
  const [user] = useAtom(userAtom);
  const currentUser = user as User;
  const setResult = async (user: User) => {
    try {
      await supabase
        .from<User>('users')
        .update({
          already_drew: true,
          draw_result: { ...user, has_been_drawn: true },
        })
        .eq('id', currentUser.id.toString());

      await supabase
        .from<User>('users')
        .update({
          has_been_drawn: true,
        })
        .eq('id', user.id.toString());
    } catch (error) {
      console.log(error);
    }
  };

  return { setResult };
}
