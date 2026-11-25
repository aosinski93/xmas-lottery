import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { lotteryRepository } from '../services/supabase';
import {
  LotteryDataProvider,
  useLotteryData,
} from './lottery-data-context';

vi.mock('../services/supabase', () => ({
  lotteryRepository: {
    listUsers: vi.fn(),
    listUtils: vi.fn(),
    listFamilies: vi.fn(),
    updateUser: vi.fn(),
    setDrawInProgress: vi.fn(),
    recordDrawResult: vi.fn(),
    resetUsers: vi.fn(),
    resetUtils: vi.fn(),
    subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
  },
}));

const DataConsumer = () => {
  const { loading, users, error } = useLotteryData();

  if (loading) {
    return <span>loading</span>;
  }

  return <span>{error ?? users.map((user) => user.first_name).join(', ')}</span>;
};

describe('LotteryDataProvider', () => {
  beforeEach(() => {
    vi.mocked(lotteryRepository.listUsers).mockResolvedValue([
      {
        id: 1,
        first_name: 'Anna',
        gift_suggestions: [],
        has_been_drawn: false,
        already_drew: false,
        draw_result: null,
        excluded_users: [],
        family: 1,
      },
    ]);
    vi.mocked(lotteryRepository.listUtils).mockResolvedValue([]);
    vi.mocked(lotteryRepository.listFamilies).mockResolvedValue([]);
  });

  it('loads shared data and subscribes to lottery tables', async () => {
    render(
      <LotteryDataProvider>
        <DataConsumer />
      </LotteryDataProvider>
    );

    expect(screen.getByText('loading')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Anna')).toBeInTheDocument());
    expect(lotteryRepository.subscribe).toHaveBeenCalledTimes(3);
  });
});
