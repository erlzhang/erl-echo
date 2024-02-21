import axios from 'axios';

import {
  BASE_URL
} from './setting';

export function fetch(book: string, id: string) {
  const url = BASE_URL + '/books/' + book + '/posts/' + id;
  return axios.get(url);
}

export function create(book: string, id: string) {
  const url = BASE_URL + '/books/' + book + '/posts';
  return axios.post(url, {
    id
  });
}

export function update(book: string, id: string, content: any) {
  const url = BASE_URL + '/books/' + book + '/posts/' + id;
  return axios.put(url, {
    content
  });
}

export function remove(book: string, id: string) {
  const url = BASE_URL + '/books/' + book + '/posts/' + id;
  return axios.delete(url);
}