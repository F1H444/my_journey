/* ============================================
   MY JOURNEY — UI
   DOM Manipulation & Render Functions
   ============================================ */

import { Utils } from './utils.js';
import { Storage } from './storage.js';
import { Auth } from './auth.js';
import { Theme } from './theme.js';

export const UI = {
  // ── DOM Cache ──
  elements: {},

  /**
   * Cache all frequently accessed DOM elements
   */
  cacheElements() {
    this.elements = {
      // Pages
      loginPage: document.getElementById('login-page'),
      dashboardPage: document.getElementById('dashboard-page'),

      // Login
      loginForm: document.getElementById('login-form'),
      loginTitle: document.getElementById('login-title'),
      loginSubtitle: document.getElementById('login-subtitle'),
      loginPasswordInput: document.getElementById('login-password'),
      loginConfirmGroup: document.getElementById('login-confirm-group'),
      loginConfirmInput: document.getElementById('login-confirm-password'),
      loginSubmitBtn: document.getElementById('login-submit-btn'),
      loginSubmitText: document.getElementById('login-submit-text'),
      loginError: document.getElementById('login-error'),
      loginThemeToggle: document.getElementById('login-theme-toggle'),
      passwordStrengthBar: document.getElementById('password-strength-bar'),
      passwordStrength: document.getElementById('password-strength'),

      // Header
      headerGreeting: document.getElementById('header-greeting'),
      headerThemeToggle: document.getElementById('header-theme-toggle'),
      logoutBtn: document.getElementById('logout-btn'),
      exportBtn: document.getElementById('export-btn'),
      importBtn: document.getElementById('import-btn'),
      importFileInput: document.getElementById('import-file-input'),

      // Stats
      statTotalEntries: document.getElementById('stat-total-entries'),
      statTopMood: document.getElementById('stat-top-mood'),
      statStreak: document.getElementById('stat-streak'),

      // Form
      formToggleBtn: document.getElementById('form-toggle-btn'),
      formCollapse: document.getElementById('form-collapse'),
      journalForm: document.getElementById('journal-form'),
      formDate: document.getElementById('form-date'),
      formTitle: document.getElementById('form-title'),
      formContent: document.getElementById('form-content'),
      charCounter: document.getElementById('char-counter'),
      moodPicker: document.getElementById('mood-picker'),
      formResetBtn: document.getElementById('form-reset-btn'),

      // Cards
      cardsGrid: document.getElementById('cards-grid'),
      entriesSection: document.getElementById('entries-section'),
      entriesCount: document.getElementById('entries-count'),

      // Modal
      deleteModal: document.getElementById('delete-modal'),
      deleteConfirmBtn: document.getElementById('delete-confirm-btn'),
      deleteCancelBtn: document.getElementById('delete-cancel-btn'),

      
      // View Modal
      viewModal: document.getElementById('view-modal'),
      viewModalTitle: document.getElementById('view-modal-title'),
      viewModalMood: document.getElementById('view-modal-mood'),
      viewModalDate: document.getElementById('view-modal-date'),
      viewModalContent: document.getElementById('view-modal-content'),
      viewCloseBtn: document.getElementById('view-close-btn'),
      // Toast
      toastContainer: document.getElementById('toast-container'),
    };
  },

  // ═══════════════════════════════════════════
  //  LOGIN PAGE
  // ═══════════════════════════════════════════

  /**
   * Initialize login page state
   */
  initLoginPage() {
    const isFirstRun = Auth.isFirstRun();

    this.elements.loginTitle.textContent = isFirstRun
      ? 'Buat Password Baru'
      : 'Selamat Datang Kembali';

    this.elements.loginSubtitle.textContent = isFirstRun
      ? 'Buat password untuk mengamankan jurnal pribadimu'
      : 'Masukkan password untuk membuka jurnalmu';

    this.elements.loginSubmitText.textContent = isFirstRun ? 'Mulai Menulis' : 'Masuk';

    // Show/hide confirm password field
    if (isFirstRun) {
      this.elements.loginConfirmGroup.classList.remove('hidden');
      this.elements.passwordStrength.classList.remove('hidden');
    } else {
      this.elements.loginConfirmGroup.classList.add('hidden');
      this.elements.passwordStrength.classList.add('hidden');
    }

    // Clear any previous errors
    this.hideLoginError();
    this.elements.loginPasswordInput.value = '';
    if (this.elements.loginConfirmInput) {
      this.elements.loginConfirmInput.value = '';
    }

    // Focus password input
    setTimeout(() => this.elements.loginPasswordInput.focus(), 600);
  },

  /**
   * Show login error
   */
  showLoginError(message) {
    this.elements.loginError.textContent = message;
    this.elements.loginError.classList.remove('hidden');
    // Shake the login card
    const card = document.querySelector('.login-card');
    card.classList.add('anim-shake');
    setTimeout(() => card.classList.remove('anim-shake'), 500);
  },

  /**
   * Hide login error
   */
  hideLoginError() {
    this.elements.loginError.textContent = '';
    this.elements.loginError.classList.add('hidden');
  },

  /**
   * Update password strength indicator
   */
  updatePasswordStrength(password) {
    const strength = Auth.getPasswordStrength(password);
    const bar = this.elements.passwordStrengthBar;

    bar.className = 'password-strength-bar';
    if (strength) {
      bar.classList.add(`strength-${strength}`);
    }
  },

  // ═══════════════════════════════════════════
  //  PAGE NAVIGATION
  // ═══════════════════════════════════════════

  /**
   * Show login page, hide dashboard
   */
  showLoginPage() {
    this.elements.loginPage.classList.remove('hidden');
    this.elements.dashboardPage.classList.add('hidden');
    this.initLoginPage();
  },

  /**
   * Show dashboard, hide login
   */
  showDashboard() {
    this.elements.loginPage.classList.add('hidden');
    this.elements.dashboardPage.classList.remove('hidden');
    this.elements.dashboardPage.classList.add('page-enter');

    this.updateGreeting();
    this.updateStats();
    this.renderEntries();
    this.initForm();
  },

  // ═══════════════════════════════════════════
  //  DASHBOARD HEADER
  // ═══════════════════════════════════════════

  /**
   * Update greeting in header
   */
  updateGreeting() {
    const greeting = Utils.getGreeting();
    this.elements.headerGreeting.textContent = greeting.text;
  },

  // ═══════════════════════════════════════════
  //  STATS BAR
  // ═══════════════════════════════════════════

  /**
   * Update all stats
   */
  updateStats() {
    const entries = Storage.getEntries();

    // Total entries
    this.elements.statTotalEntries.textContent = entries.length;

    // Top mood
    const topMood = Utils.getMostFrequentMood(entries);
    if (topMood) {
      const moodInfo = Utils.getMood(topMood);
      this.elements.statTopMood.textContent = `${moodInfo.emoji} ${moodInfo.label}`;
    } else {
      this.elements.statTopMood.textContent = '—';
    }

    // Streak
    const streak = Utils.calculateStreak(entries);
    this.elements.statStreak.textContent = `${streak} hari`;
  },

  // ═══════════════════════════════════════════
  //  JOURNAL FORM
  // ═══════════════════════════════════════════

  /**
   * Initialize form with defaults
   */
  initForm() {
    this.elements.formDate.value = Utils.getTodayDate();
    this.elements.formTitle.value = '';
    this.elements.formContent.value = '';
    this.updateCharCounter();
    this.clearMoodSelection();
  },

  /**
   * Reset form
   */
  resetForm() {
    this.initForm();
    this.elements.formTitle.focus();
  },

  /**
   * Toggle form visibility
   */
  toggleForm() {
    const collapse = this.elements.formCollapse;
    const btn = this.elements.formToggleBtn;

    if (collapse.classList.contains('open')) {
      collapse.classList.remove('open');
      btn.classList.remove('active');
    } else {
      collapse.classList.add('open');
      btn.classList.add('active');
      // Focus title after animation
      setTimeout(() => this.elements.formTitle.focus(), 400);
    }
  },

  /**
   * Update character counter for content textarea
   */
  updateCharCounter() {
    const len = this.elements.formContent.value.length;
    this.elements.charCounter.textContent = `${len} karakter`;
  },

  /**
   * Select a mood in the mood picker
   */
  selectMood(moodKey) {
    // Remove selected from all
    this.elements.moodPicker.querySelectorAll('.mood-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Add selected to clicked
    const target = this.elements.moodPicker.querySelector(`[data-mood="${moodKey}"]`);
    if (target) {
      target.classList.add('selected');
    }
  },

  /**
   * Get currently selected mood
   */
  getSelectedMood() {
    const selected = this.elements.moodPicker.querySelector('.mood-option.selected');
    return selected ? selected.dataset.mood : null;
  },

  /**
   * Clear mood selection
   */
  clearMoodSelection() {
    this.elements.moodPicker.querySelectorAll('.mood-option').forEach(opt => {
      opt.classList.remove('selected');
    });
  },

  /**
   * Validate and get form data
   * @returns {Object|null}
   */
  getFormData() {
    const date = this.elements.formDate.value;
    const title = this.elements.formTitle.value.trim();
    const content = this.elements.formContent.value.trim();
    const mood = this.getSelectedMood();

    const errors = [];
    if (!date) errors.push('Tanggal harus diisi');
    if (!title) errors.push('Judul harus diisi');
    if (!content) errors.push('Isi jurnal harus diisi');
    if (!mood) errors.push('Pilih mood kamu');

    if (errors.length > 0) {
      this.showToast(errors[0], 'error');

      // Shake the form
      const card = document.querySelector('.journal-form-card');
      card.classList.add('anim-shake');
      setTimeout(() => card.classList.remove('anim-shake'), 500);

      return null;
    }

    const moodInfo = Utils.getMood(mood);
    return {
      date,
      title,
      content,
      mood,
      color: moodInfo.color,
    };
  },

  // ═══════════════════════════════════════════
  //  ENTRIES GRID
  // ═══════════════════════════════════════════

  /**
   * Render all journal entries as cards
   */
  renderEntries() {
    const entries = Storage.getEntries();

    // Update count badge
    this.elements.entriesCount.textContent = entries.length;

    if (entries.length === 0) {
      this.elements.cardsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          
          <h3 class="empty-state-title">Belum Ada Jurnal</h3>
          <p class="empty-state-text">Mulai tulis jurnal pertamamu hari ini! Klik tombol "Tulis Jurnal Baru" di atas.</p>
        </div>
      `;
      return;
    }

    this.elements.cardsGrid.innerHTML = entries.map((entry, index) => {
      const moodInfo = Utils.getMood(entry.mood);
      const staggerClass = `stagger-${Math.min(index + 1, 12)}`;

      return `
        <article class="journal-card mood-${Utils.escapeHtml(entry.mood)} anim-fade-in-up ${staggerClass}" data-id="${Utils.escapeHtml(entry.id)}">
          <div class="card-mood-strip"></div>
          <div class="card-body">
            <div class="card-header">
              <h3 class="card-title">${Utils.escapeHtml(entry.title)}</h3>
              <span class="card-mood-emoji" title="${moodInfo.label}">${moodInfo.emoji}</span>
            </div>
            <div class="card-date">
              
              ${Utils.formatDate(entry.date)}
            </div>
            <p class="card-content">${Utils.escapeHtml(entry.content)}</p>
          </div>
          <div class="card-footer">
            <span class="card-mood-label">${moodInfo.emoji} ${moodInfo.label}</span>
            <button class="card-delete-btn tooltip" data-tooltip="Hapus" data-id="${Utils.escapeHtml(entry.id)}" aria-label="Hapus jurnal">
              🗑️
            </button>
          </div>
        </article>
      `;
    }).join('');
  },

  // ═══════════════════════════════════════════
  //  DELETE MODAL
  // ═══════════════════════════════════════════

  _pendingDeleteId: null,

  /**
   * Show delete confirmation modal
   */
  showDeleteModal(entryId) {
    this._pendingDeleteId = entryId;
    this.elements.deleteModal.classList.add('active');
  },

  /**
   * Hide delete modal
   */
  hideDeleteModal() {
    this._pendingDeleteId = null;
    this.elements.deleteModal.classList.remove('active');
  },

  /**
   * Confirm delete
   */
  confirmDelete() {
    if (!this._pendingDeleteId) return;

    const success = Storage.deleteEntry(this._pendingDeleteId);
    if (success) {
      // Animate the card out before removing
      const card = document.querySelector(`.journal-card[data-id="${this._pendingDeleteId}"]`);
      if (card) {
        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        card.style.transform = 'scale(0.8) rotate(5deg)';
        card.style.opacity = '0';
        setTimeout(() => {
          this.renderEntries();
          this.updateStats();
        }, 300);
      } else {
        this.renderEntries();
        this.updateStats();
      }
      this.showToast('Jurnal berhasil dihapus!', 'success');
    } else {
      this.showToast('Gagal menghapus jurnal', 'error');
    }

    this.hideDeleteModal();
  },

  
  // ═══════════════════════════════════════════
  //  VIEW MODAL
  // ═══════════════════════════════════════════

  showViewModal(entry) {
    if (!entry) return;
    this.elements.viewModalTitle.textContent = entry.title;
    const moodInfo = Utils.getMood(entry.mood);
    this.elements.viewModalMood.textContent = moodInfo.label;
    this.elements.viewModalDate.textContent = Utils.formatDate(entry.date);
    this.elements.viewModalContent.textContent = entry.content;
    
    this.elements.viewModal.classList.add('active');
  },

  hideViewModal() {
    this.elements.viewModal.classList.remove('active');
  },

  // ═══════════════════════════════════════════
  //  EXPORT / IMPORT
  // ═══════════════════════════════════════════

  /**
   * Handle export
   */
  handleExport() {
    const count = Storage.exportData();
    this.showToast(`${count} jurnal berhasil di-export!`, 'success');
  },

  /**
   * Handle import file selection
   */
  async handleImport(file) {
    if (!file) return;

    try {
      const result = await Storage.importData(file);
      this.renderEntries();
      this.updateStats();

      let message = `${result.imported} jurnal baru di-import!`;
      if (result.duplicates > 0) {
        message += ` (${result.duplicates} duplikat dilewati)`;
      }
      this.showToast(message, 'success');
    } catch (err) {
      this.showToast(err.message, 'error');
    }

    // Reset file input so same file can be imported again
    this.elements.importFileInput.value = '';
  },

  // ═══════════════════════════════════════════
  //  TOAST NOTIFICATIONS
  // ═══════════════════════════════════════════

  /**
   * Show a toast notification
   * @param {string} message
   * @param {'success' | 'error' | 'info'} type
   * @param {number} duration - ms
   */
  showToast(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '', error: '', info: '' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;

    this.elements.toastContainer.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);
  },
};
