import { Search, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SortMenu from './SortMenu';
import styles from './Header.module.css';

export default function Header({ searchQuery, onSearchChange, onCreateNote, sortOrder, onSortChange }) {
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>
          <span className={styles.logoFull}>iNote</span>
          <span className={styles.logoCompact}>i</span>
        </h1>
        
        <div className={styles.actions}>
          <div className={styles.search}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <SortMenu sortOrder={sortOrder} onSortChange={onSortChange} />

          <button 
            className={styles.settingsBtn} 
            onClick={() => navigate('/settings')}
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          <button className={styles.newBtn} onClick={onCreateNote}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
