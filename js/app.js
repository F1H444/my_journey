/* ============================================
   MY JOURNEY — APP
   Entry Point, Router, Event Bindings
   ============================================ */

import { Auth } from './auth.js';
import { Storage } from './storage.js';
import { Theme } from './theme.js';
import { UI } from './ui.js';
import { Utils } from './utils.js';

/**
 * Application initialization
 */
function init() {
  // 1. Initialize theme first (prevents flash)
  Theme.init();

  // 2. Cache DOM elements
  UI.cacheElements();

  // 3. Bind all events
  bindEvents();

  // 4. Route to correct page
  if (Auth.isLoggedIn()) {
    UI.showDashboard();
  } else {
    UI.showLoginPage();
  }
}

/**
 * Bind all event listeners
 */
function bindEvents() {
  // ── Login ──
  UI.elements.loginForm.addEventListener('submit', handleLogin);

  UI.elements.loginPasswordInput.addEventListener('input', (e) => {
    if (Auth.isFirstRun()) {
      UI.updatePasswordStrength(e.target.value);
    }
    UI.hideLoginError();
  });

  // ── Theme Toggles ──
  UI.elements.loginThemeToggle.addEventListener('click', () => {
    Theme.toggle();
  });

  UI.elements.headerThemeToggle.addEventListener('click', () => {
    Theme.toggle();
  });

  // ── Logout ──
  UI.elements.logoutBtn.addEventListener('click', handleLogout);

  // ── Form Toggle ──
  UI.elements.formToggleBtn.addEventListener('click', () => {
    UI.toggleForm();
  });

  // ── Form Submit ──
  UI.elements.journalForm.addEventListener('submit', handleFormSubmit);

  // ── Form Reset ──
  UI.elements.formResetBtn.addEventListener('click', () => {
    UI.resetForm();
  });

  // ── Character Counter ──
  UI.elements.formContent.addEventListener('input', () => {
    UI.updateCharCounter();
  });

  // ── Mood Picker ──
  UI.elements.moodPicker.addEventListener('click', (e) => {
    const option = e.target.closest('.mood-option');
    if (option) {
      UI.selectMood(option.dataset.mood);
    }
  });

  // ── Delete Button (Event Delegation) ──
  
  // ── Card Click (View / Delete) ──
  UI.elements.cardsGrid.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.card-delete-btn');
    const card = e.target.closest('.journal-card');
    
    if (deleteBtn) {
      e.stopPropagation();
      UI.showDeleteModal(deleteBtn.dataset.id);
    } else if (card) {
      const entryId = card.dataset.id;
      const entry = Storage.getEntryById(entryId);
      if (entry) {
        UI.showViewModal(entry);
      }
    }
  });

  UI.elements.viewCloseBtn.addEventListener('click', () => {
    UI.hideViewModal();
  });

  UI.elements.viewModal.addEventListener('click', (e) => {
    if (e.target === UI.elements.viewModal) {
      UI.hideViewModal();
    }
  });


  // ── Delete Modal Confirm/Cancel ──
  UI.elements.deleteConfirmBtn.addEventListener('click', () => {
    UI.confirmDelete();
  });

  UI.elements.deleteCancelBtn.addEventListener('click', () => {
    UI.hideDeleteModal();
      UI.hideViewModal();
  });

  // Close modal on overlay click
  UI.elements.deleteModal.addEventListener('click', (e) => {
    if (e.target === UI.elements.deleteModal) {
      UI.hideDeleteModal();
    }
  });

  // ── Export ──
  UI.elements.exportBtn.addEventListener('click', () => {
    UI.handleExport();
  });

  // ── Import ──
  UI.elements.importBtn.addEventListener('click', () => {
    UI.elements.importFileInput.click();
  });

  UI.elements.importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) UI.handleImport(file);
  });

  // ── Ripple Effect on all buttons ──
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (btn) {
      Utils.createRipple(e);
    }
  });

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', (e) => {
    // Escape to close modal
    if (e.key === 'Escape') {
      UI.hideDeleteModal();
    }
  });
}

/**
 * Handle login/register form submission
 */
async function handleLogin(e) {
  e.preventDefault();

  const password = UI.elements.loginPasswordInput.value;
  const isFirstRun = Auth.isFirstRun();

  try {
    if (isFirstRun) {
      // Registration
      const confirm = UI.elements.loginConfirmInput.value;

      if (!password) {
        UI.showLoginError('Password tidak boleh kosong');
        return;
      }

      if (password !== confirm) {
        UI.showLoginError('Password tidak cocok!');
        return;
      }

      await Auth.register(password);
      UI.showToast('Akun berhasil dibuat! Selamat menulis', 'success');
    } else {
      // Login
      if (!password) {
        UI.showLoginError('Password tidak boleh kosong');
        return;
      }

      await Auth.login(password);
    }

    // Success → show dashboard
    UI.showDashboard();
  } catch (err) {
    UI.showLoginError(err.message);
  }
}

/**
 * Handle form submission — create new entry
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const data = UI.getFormData();
  if (!data) return;

  const entry = Storage.addEntry(data);

  // Success feedback
  UI.showToast('Jurnal berhasil disimpan!', 'success');
  UI.resetForm();
  UI.renderEntries();
  UI.updateStats();

  // Close form after saving
  const collapse = UI.elements.formCollapse;
  if (collapse.classList.contains('open')) {
    setTimeout(() => UI.toggleForm(), 300);
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  Auth.logout();
  UI.showLoginPage();
  UI.showToast('Berhasil logout', 'info');
}

// ── Start the app when DOM is ready ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
