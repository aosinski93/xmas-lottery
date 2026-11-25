import { createClient } from '@supabase/supabase-js';
import type { Family } from '../types/family';
import type { User } from '../types/users';
import type { Utils } from '../types/utils';
import { SUPABASE_URL, SUPABASE_KEY } from './credentials';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type SupabaseError = {
  message: string;
};

const throwOnError = (error: SupabaseError | null) => {
  if (error) {
    throw new Error(error.message);
  }
};

const listUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from<User>('users')
    .select('*')
    .order('updated_at', { ascending: false });

  throwOnError(error);
  return data ?? [];
};

const listUtils = async (): Promise<Utils[]> => {
  const { data, error } = await supabase.from<Utils>('utils').select('*');

  throwOnError(error);
  return data ?? [];
};

const listFamilies = async (): Promise<Family[]> => {
  const { data, error } = await supabase
    .from<Family>('families')
    .select('*');

  throwOnError(error);
  return data ?? [];
};

const updateUser = async (id: number, changes: Partial<User>) => {
  const { error } = await supabase
    .from<User>('users')
    .update(changes)
    .eq('id', id);

  throwOnError(error);
};

const setDrawInProgress = async (
  family: number,
  drawInProgress: boolean,
  userDrawing: string | null
) => {
  const { error } = await supabase
    .from<Utils>('utils')
    .update({
      draw_in_progress: drawInProgress,
      user_drawing: userDrawing,
    })
    .eq('family', family);

  throwOnError(error);
};

const recordDrawResult = async (currentUser: User, drawnUser: User) => {
  await updateUser(currentUser.id, {
    already_drew: true,
    draw_result: { ...drawnUser, has_been_drawn: true },
  });
  await updateUser(drawnUser.id, { has_been_drawn: true });
};

const resetUsers = async () => {
  const { error } = await supabase
    .from<User>('users')
    .update({
      has_been_drawn: false,
      already_drew: false,
      draw_result: null,
    })
    .lt('created_at', new Date().toISOString());

  throwOnError(error);
};

const resetUtils = async (family: number) => {
  await setDrawInProgress(family, false, null);
};

type LotteryTable = 'users' | 'utils' | 'families';

const subscribe = (table: LotteryTable, onChange: () => void) =>
  supabase.from(table).on('*', onChange).subscribe();

export const lotteryRepository = {
  listUsers,
  listUtils,
  listFamilies,
  updateUser,
  setDrawInProgress,
  recordDrawResult,
  resetUsers,
  resetUtils,
  subscribe,
};
