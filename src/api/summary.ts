import axios from 'axios';

import {
  BASE_URL
} from './setting';

export function fetch(slug: string) {
  return axios.get(BASE_URL + '/summary/' + slug);
}

export function update(slug: string, form: any) {
  return axios.put(BASE_URL + '/summary/' + slug, form);
}