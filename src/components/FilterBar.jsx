import styles from './FilterBar.module.css';

export default function FilterBar({ allTags, selectedTag, onSelectTag }) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.container}>
        <button
          className={!selectedTag ? styles.tagActive : styles.tag}
          onClick={() => onSelectTag(null)}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={selectedTag === tag ? styles.tagActive : styles.tag}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
