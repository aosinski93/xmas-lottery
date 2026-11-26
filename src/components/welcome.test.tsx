import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWelcomeStep } from '../hooks/use-welcome-step';
import { Welcome } from './welcome';

vi.mock('../hooks/use-welcome-step', () => ({
  useWelcomeStep: vi.fn(),
}));

const mockedUseWelcomeStep = vi.mocked(useWelcomeStep);
const baseState: ReturnType<typeof useWelcomeStep> = {
  dropdownOpen: false,
  users: [],
  loading: false,
  loadingText: '',
  drawInProgress: false,
  drawingUser: null,
  hasUsersWithoutGiftSuggestions: false,
  toggleDropdown: vi.fn(),
  handleSetUser: vi.fn(),
};

describe('Welcome', () => {
  beforeEach(() => {
    mockedUseWelcomeStep.mockReturnValue(baseState);
  });

  it('disables selection when everyone has drawn', () => {
    mockedUseWelcomeStep.mockReturnValue({
      ...baseState,
      users: [
        {
          id: 1,
          first_name: 'Anna',
          gift_suggestions: [],
          has_been_drawn: false,
          already_drew: true,
          draw_result: null,
          excluded_users: [],
          family: 1,
        },
      ],
    });

    render(<Welcome />);

    expect(
      screen.getByRole('button', {
        name: 'Wszyscy użytkownicy już losowali',
      }),
    ).toBeDisabled();
  });

  it('announces the loading state', () => {
    mockedUseWelcomeStep.mockReturnValue({
      ...baseState,
      loading: true,
      loadingText: 'Poczekaj...',
    });

    render(<Welcome />);

    expect(screen.getByRole('status')).toHaveTextContent('Poczekaj...');
  });

  it('indicates when there are users without gift suggestions', () => {
    mockedUseWelcomeStep.mockReturnValue({
      ...baseState,
      hasUsersWithoutGiftSuggestions: true,
    });

    render(<Welcome />);

    expect(
      screen.getByText(
        'Niektórzy użytkownicy nie dodali jeszcze propozycji prezentów.',
      ),
    ).toBeInTheDocument();
  });
});
