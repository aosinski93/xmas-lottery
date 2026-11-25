import type { User } from '../types/users';

export type WheelEntry = {
  text: string;
};

export const createWheelEntries = (
  users: User[],
  currentUser: User | null
): WheelEntry[] => {
  let entries = users
    .filter(
      (user) =>
        !user.has_been_drawn &&
        user.id !== currentUser?.id &&
        !(currentUser?.excluded_users ?? []).includes(user.id)
    )
    .map(({ first_name }) => ({ text: first_name }));

  if (entries.length === 0) {
    return [];
  }

  while (entries.length < 3) {
    entries = entries.concat(entries).slice(0, 3);
  }

  return entries.slice(0, 12);
};
