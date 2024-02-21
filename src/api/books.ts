import axios from 'axios';

import {
  BASE_URL
} from './setting';

export function fetchList() {
  return axios.get(BASE_URL + '/books');
}

export function fetch(slug: string) {
  return axios.get(BASE_URL + '/books/' + slug);
}

export function create(form: any) {
  return axios.post(BASE_URL + '/books', form);
}

export function update(slug: string, form: any) {
  return axios.put(BASE_URL + '/books/' + slug, form);
}

export function remove(slug: string) {
  return axios.delete(BASE_URL + '/books/' + slug);
}