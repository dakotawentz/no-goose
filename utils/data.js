const names = [
    'Aaran',
    'Aaren',
    'Aarez',
    'Aarman',
    'Aaron',
    'Aaron-James',
    'Aarron',
    'Aaryan',
    'Aaryn',
    'Aayan',
    'Aazaan',
    'Abaan',
    'Abbas',
    'Abdallah',
    'Abdalroof',
    'Abdihakim',
    'Abdirahman',
    'Abdisalam',
    'Abdul',
    'Abdul-Aziz',
    'Abdulbasir',
    'Abdulkadir',
    'Abdulkarem',
    'Smith',
    'Jones',
    'Coollastname',
    'enter_name_here',
    'Ze',
    'Zechariah',
    'Zeek',
    'Zeeshan',
    'Zeid',
    'Zein',
    'Zen',
    'Zendel',
    'Zenith',
    'Zennon',
    'Zeph',
    'Zerah',
    'Zhen',
    'Zhi',
    'Zhong',
    'Zhuo',
    'Zi',
    'Zidane',
    'Zijie',
    'Zinedine',
    'Zion',
    'Zishan',
    'Ziya',
    'Ziyaan',
    'Zohaib',
    'Zohair',
    'Zoubaeir',
    'Zubair',
    'Zubayr',
    'Zuriel',
    'Xander',
    'Jared',
    'Courtney',
    'Gillian',
    'Clark',
    'Jared',
    'Grace',
    'Kelsey',
    'Tamar',
    'Alex',
    'Mark',
    'Tamar',
    'Farish',
    'Sarah',
    'Nathaniel',
    'Parker',
  ];
  
  const thoughts = [
    'What if we could travel to other planets?',
    'Is time travel possible?',
    'What if humans could fly like birds?',
    'What happens after we die?',
    'Why do we dream?',
    'What if money didn\'t exist?',
    'Could we live underwater?',
    'What if we could communicate with animals?',
    'What if we could live forever?',
    'Why do we exist?',
    'What if we could teleport?',
    'Are we alone in the universe?',
    'What if we could read minds?',
    'Why do we feel emotions?',
    'What if we could control the weather?',
    'Why do we sleep?',
    'What if we could speak all languages?',
    'Why do we age?',
    'What if we could become invisible?',
    'What if we could stop time?',
  ];
  
  // Get a random item given an array
  const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Function to generate random names
  const getRandomName = () =>
    `${getRandomArrItem(names)}${getRandomArrItem(names)}`;
  
  // Function to generate random thoughts
  const getRandomThoughts = (int) => {
    const results = [];
    for (let i = 0; i < int; i++) {
      results.push({
        thoughtText: getRandomArrItem(thoughts),
      });
    }
    return results;
  };
  
  // Export the functions for use
  module.exports = { getRandomName, getRandomThoughts };
  