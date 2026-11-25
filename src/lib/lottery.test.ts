import { describe, expect, it } from 'vitest';
import type { User } from '../types/users';
import { createWheelEntries } from './lottery';

const createUser = (id: number, overrides: Partial<User> = {}): User => ({
  id,
  first_name: `User ${id}`,
  gift_suggestions: [],
  has_been_drawn: false,
  already_drew: false,
  draw_result: null,
  excluded_users: [],
  family: 1,
  ...overrides,
});

describe('createWheelEntries', () => {
  it('excludes the current user, exclusions, and drawn users', () => {
    const currentUser = createUser(1, { excluded_users: [3] });
    const users = [
      currentUser,
      createUser(2),
      createUser(3),
      createUser(4, { has_been_drawn: true }),
    ];

    expect(createWheelEntries(users, currentUser)).toEqual([
      { text: 'User 2' },
      { text: 'User 2' },
      { text: 'User 2' },
    ]);
  });

  it('returns an empty list when nobody can be drawn', () => {
    const currentUser = createUser(1);

    expect(createWheelEntries([currentUser], currentUser)).toEqual([]);
  });

  it('caps the wheel at twelve entries', () => {
    const users = Array.from({ length: 20 }, (_, index) =>
      createUser(index + 1)
    );

    expect(createWheelEntries(users, null)).toHaveLength(12);
  });
});
