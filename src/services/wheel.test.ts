import { beforeEach, describe, expect, it, vi } from 'vitest';
import Wheel from 'lottery-wheel';
import { initializeWheel } from './wheel';

vi.mock('lottery-wheel', () => ({
  default: vi.fn(),
}));

describe('initializeWheel', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="wheel"></div>';
    vi.clearAllMocks();
  });

  it('passes the element, entries, and callbacks using the supported API', () => {
    const onSuccess = vi.fn();
    const data = [{ text: 'Anna' }, { text: 'Jan' }, { text: 'Maria' }];

    initializeWheel({ data, config: { onSuccess } });

    expect(Wheel).toHaveBeenCalledWith(
      expect.objectContaining({
        el: document.getElementById('wheel'),
        data,
        onSuccess,
      }),
    );
  });
});
