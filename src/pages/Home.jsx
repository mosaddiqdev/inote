import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { sampleNotes } from '../utils/seedData';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import NotesList from '../components/NotesList';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOrder, setSortOrder] = useState('updated');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // useEffect(() => {
  //   if (notes.length === 0 && !localStorage.getItem('seeded')) {
  //     setNotes(sampleNotes);
  //     localStorage.setItem('seeded', 'true');
  //   }
  // }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    notes.forEach(note => note.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let filtered = notes;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(note => note.tags?.includes(selectedTag));
    }
    
    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [notes, searchQuery, selectedTag, sortOrder]);

  const createNote = () => {
    navigate('/note/new');
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      setNotes(notes.filter(n => n.id !== noteToDelete.id));
      toast.success('Note deleted', {
        icon: <Trash2 size={18} />,
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
        }
      });
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  return (
    <div className={styles.home}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNote={createNote}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
      
      {allTags.length > 0 && (
        <FilterBar
          allTags={allTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      )}

      <main className={styles.main}>
        {filteredNotes.length === 0 ? (
          <EmptyState
            hasNotes={notes.length > 0}
            onCreateNote={createNote}
          />
        ) : (
          <NotesList
            notes={filteredNotes}
            onDeleteNote={handleDeleteClick}
          />
        )}
      </main>

      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        noteTitle={noteToDelete?.title || 'Untitled'}
      />
    </div>
  );
}
