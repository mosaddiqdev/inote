import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import styles from './NoteItem.module.css';

export default function NoteItem({ note, onDelete, isLast }) {
  const navigate = useNavigate();
  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNoteClick = () => {
    navigate(`/note/${note.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(note);
  };

  return (
    <article 
      className={`${styles.note} ${isLast ? styles.noteLast : ''}`}
      onClick={handleNoteClick}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{note.title}</h2>
        <button 
          className={styles.deleteBtn}
          onClick={handleDeleteClick}
          aria-label="Delete note"
        >
          <X size={16} />
        </button>
      </div>
      
      {note.content && (
        <p className={styles.content}>
          {note.content.split('\n').slice(0, 3).join('\n')}
        </p>
      )}
      
      <div className={styles.footer}>
        {note.tags && note.tags.length > 0 && (
          <div className={styles.tags}>
            {note.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        <span className={styles.time}>{formatTime(note.updatedAt)}</span>
      </div>
    </article>
  );
}
