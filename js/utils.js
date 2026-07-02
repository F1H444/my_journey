/* ============================================
   MY JOURNEY — UTILS
   Helper Functions
   ============================================ */

export const Utils = {
  /**
   * Generate unique ID based on timestamp + random suffix
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  },

  /**
   * Format date to locale string
   * @param {string} dateStr - ISO date string (YYYY-MM-DD)
   * @returns {string} Formatted date (e.g., "Rabu, 2 Juli 2026")
   */
  formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * Format date to relative time (e.g., "2 hari lalu")
   * @param {string} isoStr - ISO datetime string
   */
  timeAgo(isoStr) {
    const now = new Date();
    const date = new Date(isoStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return Utils.formatDate(isoStr.split('T')[0]);
  },

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Get greeting based on current time
   */
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 5) return { text: 'Selamat Malam 🌙', emoji: '🌙' };
    if (hour < 11) return { text: 'Selamat Pagi ☀️', emoji: '☀️' };
    if (hour < 15) return { text: 'Selamat Siang 🌤️', emoji: '🌤️' };
    if (hour < 18) return { text: 'Selamat Sore 🌅', emoji: '🌅' };
    return { text: 'Selamat Malam 🌙', emoji: '🌙' };
  },

  /**
   * Mood configuration map
   */
  moods: {
    happy:   { emoji: '😊', label: 'Happy',   color: '#FFD93D' },
    sad:     { emoji: '😢', label: 'Sad',     color: '#74B9FF' },
    angry:   { emoji: '😡', label: 'Angry',   color: '#FF6B6B' },
    tired:   { emoji: '😴', label: 'Tired',   color: '#A29BFE' },
    excited: { emoji: '🤩', label: 'Excited', color: '#FF9FF3' },
    calm:    { emoji: '😌', label: 'Calm',    color: '#55EFC4' },
  },

  /**
   * Get mood info by key
   */
  getMood(key) {
    return Utils.moods[key] || Utils.moods.happy;
  },

  /**
   * Truncate text to max length
   */
  truncate(text, maxLength = 120) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Debounce function
   */
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Hash a string using SHA-256 (Web Crypto API)
   * @param {string} str
   * @returns {Promise<string>} hex hash
   */
  async hashPassword(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Create ripple effect on button click
   */
  createRipple(event) {
    const btn = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - btn.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - btn.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple-effect');

    const existingRipple = btn.querySelector('.ripple-effect');
    if (existingRipple) existingRipple.remove();

    btn.appendChild(circle);

    circle.addEventListener('animationend', () => circle.remove());
  },

  /**
   * Get the most frequent mood from entries
   */
  getMostFrequentMood(entries) {
    if (!entries.length) return null;
    const counts = {};
    entries.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    const maxMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return maxMood ? maxMood[0] : null;
  },

  /**
   * Calculate writing streak (consecutive days)
   */
  calculateStreak(entries) {
    if (!entries.length) return 0;

    const sortedDates = [...new Set(entries.map(e => e.date))].sort().reverse();
    let streak = 0;
    const today = new Date(Utils.getTodayDate());

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      const expectedStr = expectedDate.toISOString().split('T')[0];

      if (sortedDates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },
};
