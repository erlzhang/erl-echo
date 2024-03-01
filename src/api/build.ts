import axios from 'axios';
import {
  BUILD_HOOK
} from './setting';

export function triggerBuild() {
  return axios.post(BUILD_HOOK);
}