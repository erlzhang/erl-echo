import axios from 'axios';

import {
  BASE_URL
} from './setting';

export function ocrLoad(base64: string) {
  return axios.post(BASE_URL + '/ocr', {
    imgData: base64
  })
}