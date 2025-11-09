export const exportNoteToText = (title, content, tags) => {
  const noteContent = `${title || 'Untitled'}\n\n${content}\n\n${tags.length > 0 ? `Tags: ${tags.join(', ')}` : ''}`;
  const blob = new Blob([noteContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(title || 'Untitled').replace(/[^a-z0-9]/gi, '_')}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};
