import { useAtom } from 'jotai';
import { userAtom } from '../atoms';
import { User } from '../types/users';
import { useLotteryData } from '../contexts/lottery-data-context';

export default function useSetDrawResult() {
  const [user] = useAtom(userAtom);
  const { recordDrawResult } = useLotteryData();
  const setResult = async (drawnUser: User) => {
    if (!user) {
      throw new Error('Nie wybrano użytkownika');
    }

    await recordDrawResult(user, drawnUser);
  };

  return { setResult };
}
