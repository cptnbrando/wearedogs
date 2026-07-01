import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import TitlePage from './TitlePage.svelte';
import { describe, it, expect, vi } from 'vitest';

describe('TitlePage UI & UX Landing Page Interaction', () => {
  it('should toggle the stats widget and runic navigation buttons when clicking the center text', async () => {
    // Render TitlePage
    const { container } = render(TitlePage);

    // Ensure the words wrapper (which contains the center text "We Are Dogs") exists
    const wordsWrapper = container.querySelector('.words-wrapper');
    expect(wordsWrapper).toBeInTheDocument();

    // Verify stats panel/widget is not open/displayed initially
    let statsWidget = container.querySelector('.lang-meta');
    expect(statsWidget).toBeNull();

    // Verify hieroglyphic runic nav buttons are not present initially
    let runicNav = container.querySelector('.hieroglyphic-nav');
    expect(runicNav).toBeNull();

    // Click the center text (words-wrapper) to toggle pause state (turn on stats/nav)
    await fireEvent.click(wordsWrapper);
    await tick();

    // Verify stats panel/widget is now displayed
    statsWidget = container.querySelector('.lang-meta');
    expect(statsWidget).toBeInTheDocument();

    // Verify hieroglyphic runic nav buttons are now displayed
    runicNav = container.querySelector('.hieroglyphic-nav');
    expect(runicNav).toBeInTheDocument();

    // Click the center text (words-wrapper) again to toggle pause state off
    await fireEvent.click(wordsWrapper);
    await tick();

    // Verify stats panel/widget is hidden again
    statsWidget = container.querySelector('.lang-meta');
    expect(statsWidget).toBeNull();

    // Verify hieroglyphic runic nav buttons are hidden again
    runicNav = container.querySelector('.hieroglyphic-nav');
    expect(runicNav).toBeNull();
  });
});
