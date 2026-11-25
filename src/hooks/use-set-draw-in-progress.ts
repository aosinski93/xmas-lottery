import { useLotteryData } from '../contexts/lottery-data-context';
import { useFamilyId } from './use-family-id';

export default function useSetDrawInProgress() {
  const familyId = Number(useFamilyId());
  const { setDrawInProgress } = useLotteryData();

  const setDrawInProgressTrue = (username: string) =>
    setDrawInProgress(familyId, true, username);

  const setDrawInProgressFalse = () =>
    setDrawInProgress(familyId, false, null);

  return { setDrawInProgressTrue, setDrawInProgressFalse };
}
