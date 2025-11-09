import { FileText } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({ hasNotes, onCreateNote }) {
  return (
    <div className={styles.empty}>
      <FileText size={40} strokeWidth={1.5} />
      <div className={styles.content}>
        <h2>{hasNotes ? 'No notes found' : 'No notes yet'}</h2>
        <p>
          {hasNotes
            ? 'Try adjusting your search or filters'
            : 'Create your first note to get started'}
        </p>
      </div>
      {!hasNotes && (
        <button className={styles.btn} onClick={onCreateNote}>
          Create Note
        </button>
      )}
    </div>
  );
}
