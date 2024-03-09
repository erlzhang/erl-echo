import axios from "axios";

import {
  BASE_URL
} from './setting';

export function upload(file: any, prefix: string) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('prefix', prefix);
  return axios.post(BASE_URL + '/images', formData);
}

export function createFolder(prefix: string, name: string) {
  const formData = new FormData();
  formData.append('prefix', prefix + name + '/');
  formData.append('isFolder', '1')
  return axios.post(BASE_URL + '/images', formData);

}

export async function getImages(prefix: string) {
  return axios.get(BASE_URL +'/images', {
    params: {
      prefix
    }
  });
}

export async function remove(name: string) {
  return axios({
    url: BASE_URL + '/images',
    method: 'DELETE',
    data: {
      name
    }
  });
}