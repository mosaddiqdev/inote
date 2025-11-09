import NoteItem from './NoteItem';
import styles from './NotesList.module.css';

export default function NotesList({ notes, onDeleteNote }) {
  return (
    <div className={styles.list}>
      {notes.map((note, index) => (
        <NoteItem
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
          isLast={index === notes.length - 1}
        />
      ))}
    </div>
  );
}
