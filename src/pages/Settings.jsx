import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Download, Upload, Trash2, Info, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DeleteModal from '../components/DeleteModal';
import { validateNotes, mergeNotes } from '../utils/validateNotes';
import styles from './Settings.module.css';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [showClearModal, setShowClearModal] = useState(false);
  const fileInputRef = useRef(null);

  const exportAllNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inote-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Notes exported successfully');
  };

  const importNotes = (event) => {
    const file = event.target.files?.[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedNotes = JSON.parse(e.target.result);
        if (!validateNotes(importedNotes)) {
          toast.error('Import failed: invalid file structure');
          return;
        }

        const merged = mergeNotes(notes, importedNotes);
        setNotes(merged);
        toast.success(`Imported ${importedNotes.length} notes`);
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import notes');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    setNotes([]);
    setShowClearModal(false);
    toast.success('All data cleared');
  };

  const getStorageSize = () => {
    const size = new Blob([JSON.stringify(notes)]).size;
    return (size / 1024).toFixed(2);
  };

  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className={styles.title}>Settings</h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Appearance</h2>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Theme</div>
                <div className={styles.settingDesc}>
                  Choose your preferred color scheme
                </div>
              </div>
              <button 
                className={styles.themeToggle}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <>
                    <Moon size={16} />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Management</h2>
            
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Storage Usage</div>
                <div className={styles.settingDesc}>
                  {notes.length} notes • {getStorageSize()} KB
                </div>
              </div>
            </div>

            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Export All Notes</div>
                <div className={styles.settingDesc}>
                  Download all notes as JSON backup
                </div>
              </div>
              <button 
                className={styles.actionBtn}
                onClick={exportAllNotes}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>

            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Import Notes</div>
                <div className={styles.settingDesc}>
                  Restore notes from JSON backup
                </div>
              </div>
              <label className={styles.actionBtn}>
                <Upload size={16} />
                <span>Import</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={importNotes}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>Clear All Data</div>
                <div className={styles.settingDesc}>
                  Delete all notes permanently
                </div>
              </div>
              <button 
                className={`${styles.actionBtn} ${styles.danger}`}
                onClick={() => setShowClearModal(true)}
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About</h2>
            
            <div className={styles.about}>
              <a 
                href="https://github.com/mosaddiqdev/inote" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.githubIcon}
                aria-label="View on GitHub"
              >
                <Github size={18} />
              </a>

              <div className={styles.appName}>iNote</div>
              <div className={styles.version}>Version 1.0.0</div>
              
              <div className={styles.features}>
                <div className={styles.feature}>
                  <Info size={14} />
                  <span>Simple & minimal note-taking</span>
                </div>
                <div className={styles.feature}>
                  <Info size={14} />
                  <span>Tag organization</span>
                </div>
                <div className={styles.feature}>
                  <Info size={14} />
                  <span>Export to PDF & Text</span>
                </div>
                <div className={styles.feature}>
                  <Info size={14} />
                  <span>Dark & Light themes</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <DeleteModal
        isOpen={showClearModal}
        onConfirm={clearAllData}
        onCancel={() => setShowClearModal(false)}
        noteTitle="all notes"
        message="This will permanently delete all your notes. This action cannot be undone."
      />
    </div>
  );
}
