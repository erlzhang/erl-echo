import { words } from 'lodash';

export function getWordCount(html: string): number {
  let str: string = html.replace(/<[^>]+>/g, '');
  return words(str, /[\s\p{sc=Han}]/gu).length
}