/* ============================================
   MY JOURNEY — STORAGE
   CRUD LocalStorage + Export/Import
   ============================================ */

const STORAGE_KEY = 'mj_entries';

export const Storage = {
  /**
   * Get all journal entries, sorted by newest first
   * @returns {Array} Array of entry objects
   */
  getEntries() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const entries = JSON.parse(data);
      return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (e) {
      console.error('Storage: Error reading entries', e);
      return [];
    }
  },

  /**
   * Add a new journal entry
   * @param {Object} entry - { date, title, content, mood, color }
   * @returns {Object} The created entry with id and createdAt
   */
  addEntry(entry) {
    const entries = this.getEntries();
    const newEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      date: entry.date,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      color: entry.color,
      createdAt: new Date().toISOString(),
    };
    entries.push(newEntry);
    this._save(entries);
    return newEntry;
  },

  /**
   * Delete a journal entry by ID
   * @param {string} id
   * @returns {boolean} success
   */
  deleteEntry(id) {
    const entries = this.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    if (filtered.length === entries.length) return false;
    this._save(filtered);
    return true;
  },

  /**
   * Get a single entry by ID
   * @param {string} id
   * @returns {Object|null}
   */
  getEntryById(id) {
    const entries = this.getEntries();
    return entries.find(e => e.id === id) || null;
  },

  /**
   * Export all entries as JSON file download
   */
  exportData() {
    const entries = this.getEntries();
    const dataStr = JSON.stringify({
      app: 'MyJourney',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      entries: entries,
    }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `my-journey-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    return entries.length;
  },

  /**
   * Import entries from a JSON file
   * @param {File} file
   * @returns {Promise<{imported: number, total: number}>}
   */
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          let importedEntries = [];

          // Support both raw array and wrapped format
          if (Array.isArray(json)) {
            importedEntries = json;
          } else if (json.entries && Array.isArray(json.entries)) {
            importedEntries = json.entries;
          } else {
            throw new Error('Format file tidak valid');
          }

          // Validate each entry has required fields
          const validEntries = importedEntries.filter(e =>
            e.id && e.date && e.title && e.content && e.mood
          );

          if (validEntries.length === 0) {
            throw new Error('Tidak ada entri valid ditemukan');
          }

          // Merge with existing entries (avoid duplicates by id)
          const existing = this.getEntries();
          const existingIds = new Set(existing.map(e => e.id));
          const newEntries = validEntries.filter(e => !existingIds.has(e.id));
          const merged = [...existing, ...newEntries];

          this._save(merged);
          resolve({
            imported: newEntries.length,
            total: merged.length,
            duplicates: validEntries.length - newEntries.length,
          });
        } catch (e) {
          reject(new Error(e.message || 'Gagal membaca file JSON'));
        }
      };

      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsText(file);
    });
  },

  /**
   * Get stats for dashboard
   */
  getStats() {
    const entries = this.getEntries();
    return {
      totalEntries: entries.length,
      entries: entries,
    };
  },

  /**
   * Clear all entries (danger!)
   */
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Internal: save entries array to localStorage
   */
  _save(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Storage: Error saving entries', e);
      throw new Error('Gagal menyimpan data. LocalStorage mungkin penuh.');
    }
  },
};
