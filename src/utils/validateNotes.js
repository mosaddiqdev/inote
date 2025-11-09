const REQUIRED_STRING_FIELDS = ['id', 'title', 'content'];

const sanitizeTags = (tags = []) =>
  tags
    .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
    .map(tag => tag.trim().toLowerCase());

const isIsoDate = (value) => {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export const validateNote = (note) => {
  if (typeof note !== 'object' || note === null) return false;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof note[field] !== 'string') return false;
  }

  if (!Array.isArray(note.tags)) return false;
  if (!note.tags.every(tag => typeof tag === 'string')) return false;

  if (note.createdAt && !isIsoDate(note.createdAt)) return false;
  if (note.updatedAt && !isIsoDate(note.updatedAt)) return false;

  return true;
};

export const validateNotes = (notes) => {
  if (!Array.isArray(notes)) return false;
  const seenIds = new Set();

  for (const note of notes) {
    if (!validateNote(note)) return false;
    if (seenIds.has(note.id)) return false;
    seenIds.add(note.id);
  }

  return true;
};

export const mergeNotes = (existing = [], incoming = []) => {
  const next = new Map();

  existing.forEach(note => {
    if (validateNote(note)) {
      next.set(note.id, {
        ...note,
        tags: sanitizeTags(note.tags),
      });
    }
  });

  incoming.forEach(note => {
    if (!validateNote(note)) return;
    const normalized = {
      ...note,
      tags: sanitizeTags(note.tags),
    };

    const current = next.get(normalized.id);
    if (!current) {
      next.set(normalized.id, normalized);
      return;
    }

    const currentUpdatedAt = current.updatedAt ? new Date(current.updatedAt).getTime() : 0;
    const incomingUpdatedAt = normalized.updatedAt ? new Date(normalized.updatedAt).getTime() : 0;

    if (incomingUpdatedAt >= currentUpdatedAt) {
      next.set(normalized.id, { ...current, ...normalized });
    }
  });

  return Array.from(next.values())
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
};
