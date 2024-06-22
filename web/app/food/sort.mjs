import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('./data.json'));

data.sort((a, b) => {
  return b.latitude - aß.latitude;
});

writeFileSync('./data.json', JSON.stringify(data, null, '  '));
