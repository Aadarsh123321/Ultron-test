export const testsData = [];

// JEE Advanced (Tests 1 to 36, Paper 1 & Paper 2)
for (let i = 1; i <= 36; i++) {
  const num = i.toString().padStart(2, '0');
  testsData.push({
    id: `ja-${i}`,
    title: `Test ${num}`,
    category: 'ja',
    papers: [
      { name: 'Paper 1', url: `advanced/Test ${num} (Advanced) (Paper 01).html` },
      { name: 'Paper 2', url: `advanced/Test ${num} (Advanced) (Paper 02).html` }
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
    { name: 'Paper 1', url: 'universal/Universe test (JA P1).html' },
    { name: 'Paper 2', url: 'universal/Universe test (JA P2).html' }
  ]
});

testsData.push({
  id: 'uni-ja-only',
  title: 'Universe Test (JA Only)',
  category: 'universal',
  subcat: 'ja',
  papers: [
    { name: 'Paper 1', url: 'universal/Universe test (Jee advanced only P1).html' }
  ]
});

testsData.push({
  id: 'uni-jm-1',
  title: 'Universe Test (JM 01)',
  category: 'universal',
  subcat: 'jm',
  papers: [
    { name: 'Full Paper', url: 'universal/Universe test (Jee mains 01).html' }
  ]
});

testsData.push({
  id: 'uni-jm-2',
  title: 'Universe Test (JM 02)',
  category: 'universal',
  subcat: 'jm',
  papers: [
    { name: 'Full Paper', url: 'universal/Universe test (Jee mains 02).html' }
  ]
});

// JEE Mains
testsData.push({
  id: 'jm-1',
  title: 'Mains Test 01',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 01.html' }
  ]
});

testsData.push({
  id: 'jm-2',
  title: 'Mains Test 02',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 02.html' }
  ]
});

testsData.push({
  id: 'jm-3',
  title: 'Mains Test 03',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 03.html' }
  ]
});

testsData.push({
  id: 'jm-4',
  title: 'Mains Test 04',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 04.html' }
  ]
});

testsData.push({
  id: 'jm-5',
  title: 'Mains Test 05',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 05.html' }
  ]
});

testsData.push({
  id: 'jm-6',
  title: 'Mains Test 06',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 06.html' }
  ]
});

testsData.push({
  id: 'jm-7',
  title: 'Mains Test 07',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 07.html' }
  ]
});

testsData.push({
  id: 'jm-8',
  title: 'Mains Test 08',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 08.html' }
  ]
});

testsData.push({
  id: 'jm-9',
  title: 'Mains Test 09',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 09.html' }
  ]
});

testsData.push({
  id: 'jm-10',
  title: 'Mains Test 10',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 10.html' }
  ]
});

testsData.push({
  id: 'jm-11',
  title: 'Mains Test 11',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 11.html' }
  ]
});

testsData.push({
  id: 'jm-12',
  title: 'Mains Test 12',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 12.html' }
  ]
});

testsData.push({
  id: 'jm-13',
  title: 'Mains Test 13',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 13.html' }
  ]
});

testsData.push({
  id: 'jm-14',
  title: 'Mains Test 14',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 14.html' }
  ]
});

testsData.push({
  id: 'jm-15',
  title: 'Mains Test 15',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 15.html' }
  ]
});

testsData.push({
  id: 'jm-16',
  title: 'Mains Test 16',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 16.html' }
  ]
});

testsData.push({
  id: 'jm-17',
  title: 'Mains Test 17',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 17.html' }
  ]
});

testsData.push({
  id: 'jm-18',
  title: 'Mains Test 18',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 18.html' }
  ]
});

testsData.push({
  id: 'jm-19',
  title: 'Mains Test 19',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 19.html' }
  ]
});

testsData.push({
  id: 'jm-20',
  title: 'Mains Test 20',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 20.html' }
  ]
});

testsData.push({
  id: 'jm-21',
  title: 'Mains Test 21',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 21.html' }
  ]
});

testsData.push({
  id: 'jm-22',
  title: 'Mains Test 22',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 22.html' }
  ]
});

testsData.push({
  id: 'jm-23',
  title: 'Mains Test 23',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 23.html' }
  ]
});

testsData.push({
  id: 'jm-24',
  title: 'Mains Test 24',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 24.html' }
  ]
});

testsData.push({
  id: 'jm-25',
  title: 'Mains Test 25',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 25.html' }
  ]
});

testsData.push({
  id: 'jm-26',
  title: 'Mains Test 26',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 26.html' }
  ]
});

testsData.push({
  id: 'jm-27',
  title: 'Mains Test 27',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 27.html' }
  ]
});

testsData.push({
  id: 'jm-28',
  title: 'Mains Test 28',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 28.html' }
  ]
});

testsData.push({
  id: 'jm-29',
  title: 'Mains Test 29',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 29.html' }
  ]
});

testsData.push({
  id: 'jm-30',
  title: 'Mains Test 30',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 30.html' }
  ]
});

testsData.push({
  id: 'jm-31',
  title: 'Mains Test 31',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 31.html' }
  ]
});

testsData.push({
  id: 'jm-32',
  title: 'Mains Test 32',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 32.html' }
  ]
});

testsData.push({
  id: 'jm-33',
  title: 'Mains Test 33',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 33.html' }
  ]
});

testsData.push({
  id: 'jm-34',
  title: 'Mains Test 34',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 34.html' }
  ]
});

testsData.push({
  id: 'jm-35',
  title: 'Mains Test 35',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 35.html' }
  ]
});

testsData.push({
  id: 'jm-36',
  title: 'Mains Test 36 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 36 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-37',
  title: 'Mains Test 37',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 37.html' }
  ]
});

testsData.push({
  id: 'jm-38',
  title: 'Mains Test 38 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 38 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-39',
  title: 'Mains Test 39',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 39.html' }
  ]
});

testsData.push({
  id: 'jm-40',
  title: 'Mains Test 40 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 40 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-41',
  title: 'Mains Test 41',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 41.html' }
  ]
});

testsData.push({
  id: 'jm-42',
  title: 'Mains Test 42',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 42.html' }
  ]
});

testsData.push({
  id: 'jm-43',
  title: 'Mains Test 43',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 43.html' }
  ]
});

testsData.push({
  id: 'jm-44',
  title: 'Mains Test 44 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 44 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-45',
  title: 'Mains Test 45 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 45 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-46',
  title: 'Mains Test 46 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 46 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-47',
  title: 'Mains Test 47 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 47 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-48',
  title: 'Mains Test 48',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 48.html' }
  ]
});

testsData.push({
  id: 'jm-49',
  title: 'Mains Test 49',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 49.html' }
  ]
});

testsData.push({
  id: 'jm-50',
  title: 'Mains Test 50',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 50.html' }
  ]
});

testsData.push({
  id: 'jm-51',
  title: 'Mains Test 51 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 51 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-52',
  title: 'Mains Test 52 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 52 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-53',
  title: 'Mains Test 53 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 53 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-54',
  title: 'Mains Test 54 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 54 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-55',
  title: 'Mains Test 55 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 55 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-56',
  title: 'Mains Test 56 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 56 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-57',
  title: 'Mains Test 57 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 57 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-58',
  title: 'Mains Test 58 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 58 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-59',
  title: 'Mains Test 59 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 59 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-60',
  title: 'Mains Test 60 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 60 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-61',
  title: 'Mains Test 61 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 61 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-62',
  title: 'Mains Test 62 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 62 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-63',
  title: 'Mains Test 63 (PYP)',
  category: 'jm',
  subcat: 'pyp',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 63 (pyp).html' }
  ]
});

testsData.push({
  id: 'jm-64',
  title: 'Mains Test 64',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 64.html' }
  ]
});

testsData.push({
  id: 'jm-65',
  title: 'Mains Test 65',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 65.html' }
  ]
});

testsData.push({
  id: 'jm-66',
  title: 'Mains Test 66',
  category: 'jm',
  subcat: 'mock',
  papers: [
    { name: 'Full Paper', url: 'mains/Mains Test 66.html' }
  ]
});

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
