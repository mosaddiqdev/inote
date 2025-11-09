export const sampleNotes = [
  {
    id: crypto.randomUUID(),
    title: 'Welcome to iNote',
    content: 'This is your personal notes app.\n\nFeatures:\n- Create and delete notes\n- Search across all notes\n- Filter by tags\n- Sort by date or alphabetically',
    tags: ['welcome', 'guide'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Project Ideas',
    content: 'Build a portfolio website\nCreate a task manager\nDevelop a weather app\nMake a recipe organizer',
    tags: ['ideas', 'projects'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Shopping List',
    content: 'Milk\nBread\nEggs\nCoffee\nFruits',
    tags: ['personal', 'shopping'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Meeting Notes',
    content: 'Discussed Q4 goals\nReview sprint progress\nPlan next release\nAddress technical debt',
    tags: ['work', 'meetings'],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Learning Resources',
    content: 'React documentation\nJavaScript.info\nMDN Web Docs\nFreeCodeCamp',
    tags: ['learning', 'resources'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];
