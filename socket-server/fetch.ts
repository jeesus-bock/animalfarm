import { DATA_SERVER_PORT, Map } from '../common';

export const fetchGenMap = async () => {
  console.log('fetchGenMap');
  const response = await fetch('http://localhost:' + DATA_SERVER_PORT + '/maps/generate');
  return response.json();
};
export const fetchMaps = async () => {
  console.log('fetchMaps');
  const response = await fetch('http://localhost:' + DATA_SERVER_PORT + '/maps');
  return response.json();
};

export const postMap = async (map: Map) => {
  const response = await fetch('http://localhost:' + DATA_SERVER_PORT + '/maps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(map),
  });
  return response.json();
};
