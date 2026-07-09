import { render } from '@testing-library/svelte';
import DogsMain from '../DogsMain.svelte';
import { describe, it, expect } from 'vitest';

describe('DogsMain Component - Text Color & Styling Stability', () => {
  it('should render the dictionary text elements with white color utility classes', () => {
    const { container } = render(DogsMain, {
      isFlagColors: false,
      active: true
    });

    const dictWord = container.querySelector('.dict-word');
    const phonetic = container.querySelector('.phonetic');
    const partOfSpeech = container.querySelector('.part-of-speech');
    const dictDef = container.querySelector('.dict-def');

    expect(dictWord).toBeInTheDocument();
    expect(dictWord).toHaveClass('text-white');
    expect(dictWord).not.toHaveClass('text-black');

    expect(phonetic).toBeInTheDocument();
    expect(phonetic).toHaveClass('text-white/50');
    expect(phonetic).not.toHaveClass('text-black/50');

    expect(partOfSpeech).toBeInTheDocument();
    expect(partOfSpeech).toHaveClass('text-white/40');
    expect(partOfSpeech).not.toHaveClass('text-black/40');

    expect(dictDef).toBeInTheDocument();
    expect(dictDef).toHaveClass('text-white/80');
    expect(dictDef).not.toHaveClass('text-black/80');
  });

  it('should render card titles and badges under info-card elements with expected styling classes', () => {
    const { container } = render(DogsMain, {
      isFlagColors: false,
      active: true
    });

    const cardTitles = container.querySelectorAll('.info-card .card-title');
    expect(cardTitles.length).toBeGreaterThan(0);
    cardTitles.forEach((title) => {
      // Card titles must have the text-black/40 class to remain black on light cards
      expect(title).toHaveClass('text-black/40');
      expect(title).not.toHaveClass('text-white/40');
    });

    const badges = container.querySelectorAll('.info-card .badge');
    expect(badges.length).toBeGreaterThan(0);
    badges.forEach((badge) => {
      // Badges must have text-white and bg-black classes
      expect(badge).toHaveClass('text-white');
      expect(badge).toHaveClass('bg-black');
    });
  });
});
