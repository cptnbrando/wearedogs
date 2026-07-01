import { render, fireEvent, screen } from '@testing-library/svelte';
import SwipeTabNav from './SwipeTabNav.svelte';
import { describe, it, expect, vi } from 'vitest';

describe('SwipeTabNav viewport centering tests', () => {
  it('SwipeTabNav Test Suite test works!', () => {
    expect(true).toBe(true);
  });

  it('centers active tab using container local scroll and does not trigger scrollIntoView', async () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
      { id: 'tab3', label: 'Tab 3' },
      { id: 'tab4', label: 'Tab 4' },
      { id: 'tab5', label: 'Tab 5' }
    ];

    // Mock scrollTo and scrollIntoView on HTMLElement prototype
    const mockScrollTo = vi.fn();
    const mockScrollIntoView = vi.fn();

    const originalScrollTo = HTMLElement.prototype.scrollTo;
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;

    HTMLElement.prototype.scrollTo = mockScrollTo;
    HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    try {
      const { rerender } = render(SwipeTabNav, {
        tabs,
        activeTab: 'tab1'
      });

      // Wait for the effect and setTimeout
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Trigger activeTab change
      await rerender({
        tabs,
        activeTab: 'tab4'
      });

      // Wait for effect timeout
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert that scrollIntoView was never invoked (preventing page/fixed container shift)
      expect(mockScrollIntoView).not.toHaveBeenCalled();

      // Assert that container local scrollTo was called to adjust the scrollLeft
      expect(mockScrollTo).toHaveBeenCalled();
    } finally {
      // Clean up prototypes
      HTMLElement.prototype.scrollTo = originalScrollTo;
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    }
  });
});
