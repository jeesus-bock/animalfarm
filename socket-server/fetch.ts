import { DATA_SERVER_PORT, Level } from '../common';

export const fetchGenLevel = async () => {
  console.log('fetchGenLevel');
  const response = await fetch('http://localhost:' + DATA_SERVER_PORT + '/levels/generate');
  return response.json() as Promise<Level>;
};
export const fetchLevels = async () => {
  console.log('fetchLevels');
  const response = await fetch('http://localhost:' + DATA_SERVER_PORT + '/levels');
  console.log(response);
  return response.json() as Promise<Array<Level>>;
};

export const postLevel = async (level: Level) => {
  const response = await fetch('http://localhost:' + DATA_SERVER_PORT + '/levels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(level),
  });
  return response.json() as Promise<Level>;
};
