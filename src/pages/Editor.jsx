import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, X, Tag as TagIcon, Download, FileText, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import DeleteModal from '../components/DeleteModal';
import { exportNoteToPDF } from '../utils/pdfExport';
import { exportNoteToText } from '../utils/textExport';
import styles from './Editor.module.css';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const titleInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const contentRef = useRef(null);
  const exportMenuRef = useRef(null);

  const isNewNote = id === 'new';
  const currentNote = notes.find(n => n.id === id);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showExportMenu) {
        setShowExportMenu(false);
      }
    };

    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  useEffect(() => {
    if (isNewNote) {
      setTitle('');
      setContent('');
      setTags([]);
      titleInputRef.current?.focus();
    } else if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setTags(currentNote.tags || []);
    } else {
      navigate('/');
    }
  }, [id, isNewNote, currentNote, navigate]);

  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const noteData = {
      title: title.trim() || 'Untitled',
      content: content.trim(),
      tags: tags,
      updatedAt: new Date().toISOString()
    };

    if (isNewNote) {
      const newNote = {
        id: crypto.randomUUID(),
        ...noteData,
        createdAt: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
      navigate(`/note/${newNote.id}`, { replace: true });
    } else {
      setNotes(notes.map(n => 
        n.id === id ? { ...n, ...noteData } : n
      ));
    }
  };

  const handleDelete = () => {
    setNotes(notes.filter(n => n.id !== id));
    toast.success('Note deleted', { icon: <Trash2 size={18} /> });
    navigate('/');
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const toggleTagInput = () => {
    setShowTagInput(!showTagInput);
    if (!showTagInput) {
      setTimeout(() => tagInputRef.current?.focus(), 100);
    }
  };

  const handleExportAsText = () => {
    exportNoteToText(title, content, tags);
    setShowExportMenu(false);
    toast.success('Exported as text file');
  };

  const handleExportAsPDF = () => {
    try {
      exportNoteToPDF(title, content, tags);
      setShowExportMenu(false);
      toast.success('Exported as PDF');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className={styles.editor}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
          </button>

          <div className={styles.headerActions}>
            <div className={styles.exportMenu} ref={exportMenuRef}>
              <button 
                className={styles.exportBtn}
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download size={18} />
              </button>

              {showExportMenu && (
                <div className={styles.exportDropdown}>
                  <button onClick={handleExportAsText}>
                    <FileText size={16} />
                    <span>Export as Text</span>
                  </button>
                  <button onClick={handleExportAsPDF}>
                    <FileDown size={16} />
                    <span>Export as PDF</span>
                  </button>
                </div>
              )}
            </div>

            {!isNewNote && (
              <button 
                className={styles.deleteBtn}
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container} ref={contentRef}>
          <input
            ref={titleInputRef}
            type="text"
            className={styles.titleInput}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className={styles.contentInput}
            placeholder="Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className={styles.footer}>
            {tags.length > 0 && (
              <div className={styles.tagsList}>
                {tags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <button 
                className={styles.tagBtn}
                onClick={toggleTagInput}
              >
                <TagIcon size={18} />
              </button>

              {showTagInput && (
                <form onSubmit={handleAddTag} className={styles.tagForm}>
                  <input
                    ref={tagInputRef}
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onBlur={() => {
                      if (!tagInput) setShowTagInput(false);
                    }}
                    className={styles.tagInput}
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        noteTitle={title || 'Untitled'}
      />
    </div>
  );
}
