export const testsData = [];

// JEE Advanced (Tests 1 to 36, Paper 1 & Paper 2)
for (let i = 1; i <= 36; i++) {
  const num = i.toString().padStart(2, '0');
  testsData.push({
    id: `ja-${i}`,
    title: `Test ${num}`,
    category: 'ja',
    papers: [
      { name: 'Paper 1', url: `Test ${num} (Advanced) (Paper 01).html` },
      { name: 'Paper 2', url: `Test ${num} (Advanced) (Paper 02).html` }
    ]
  });
}

// Universal Tests (5 files provided)
testsData.push({
  id: 'uni-ja-1',
  title: 'Universe Test (JA)',
  category: 'universal',
  subcat: 'ja',
  papers: [
    { name: 'Paper 1', url: 'Universe test (JA P1).html' },
    { name: 'Paper 2', url: 'Universe test (JA P2).html' }
  ]
});

testsData.push({
  id: 'uni-ja-only',
  title: 'Universe Test (JA Only)',
  category: 'universal',
  subcat: 'ja',
  papers: [
    { name: 'Paper 1', url: 'Universe test (Jee advanced only P1).html' }
  ]
});

testsData.push({
  id: 'uni-jm-1',
  title: 'Universe Test (JM 01)',
  category: 'universal',
  subcat: 'jm',
  papers: [
    { name: 'Full Paper', url: 'Universe test (Jee mains 01).html' }
  ]
});

testsData.push({
  id: 'uni-jm-2',
  title: 'Universe Test (JM 02)',
  category: 'universal',
  subcat: 'jm',
  papers: [
    { name: 'Full Paper', url: 'Universe test (Jee mains 02).html' }
  ]
});

// JEE Mains placeholder (Easy to add more later)
for (let i = 1; i <= 20; i++) {
  const num = i.toString().padStart(2, '0');
  testsData.push({
    id: `jm-${i}`,
    title: `Mains Test ${num}`,
    category: 'jm',
    papers: [
      { name: 'Full Paper', url: `#` } // Replace '#' with actual file name when available
    ]
  });
}

// PYQ placeholder
for (let i = 1; i <= 10; i++) {
  testsData.push({
    id: `pyq-${i}`,
    title: `PYQ 202${i % 10}`,
    category: 'pyq',
    papers: [
      { name: 'Paper', url: `#` }
    ]
  });
}

// AITS placeholder
for (let i = 1; i <= 10; i++) {
  testsData.push({
    id: `aits-${i}`,
    title: `AITS ${i}`,
    category: 'aits',
    papers: [
      { name: 'Paper', url: `#` }
    ]
  });
}
