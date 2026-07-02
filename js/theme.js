/* ============================================
   MY JOURNEY — THEME
   Dark/Light Mode Toggle + Persistence
   ============================================ */

const THEME_KEY = 'mj_theme';

export const Theme = {
  /**
   * Initialize theme from localStorage or system preference
   */
  init() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      this.apply(saved);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(prefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  },

  /**
   * Toggle between light and dark
   */
  toggle() {
    const current = this.getCurrent();
    const next = current === 'light' ? 'dark' : 'light';
    this.apply(next);
    localStorage.setItem(THEME_KEY, next);
    return next;
  },

  /**
   * Apply a specific theme
   * @param {'light' | 'dark'} theme
   */
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this._updateToggleButton(theme);
  },

  /**
   * Get current theme
   * @returns {'light' | 'dark'}
   */
  getCurrent() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  },

  /**
   * Update the toggle button icon
   */
  _updateToggleButton(theme) {
    const buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(btn => {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  },
};
