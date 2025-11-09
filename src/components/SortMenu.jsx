import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Clock, Calendar, Type } from 'lucide-react';
import styles from './SortMenu.module.css';

export default function SortMenu({ sortOrder, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sortOptions = [
    { value: 'updated', label: 'Last Modified', icon: Clock },
    { value: 'created', label: 'Date Created', icon: Calendar },
    { value: 'alphabetical', label: 'Alphabetical', icon: Type },
  ];

  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.sortMenu} ref={menuRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sort options"
      >
        <ArrowUpDown size={18} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {sortOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              className={`${styles.option} ${sortOrder === value ? styles.active : ''}`}
              onClick={() => handleSelect(value)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
