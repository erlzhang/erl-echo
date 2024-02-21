import Chapter from './chapter'
import {
  fetch,
  update
} from '@/api/summary';
import {
  create as createPost,
  remove as removePost
} from '@/api/posts';
import { v4 as uuidv4 } from 'uuid';
import { sumBy } from 'lodash';

//  暂时先不考虑层级关系
export default class Summary {
  slug:string = "";
  data:Array<Chapter> = [];
  _data:Map<string, Chapter> = new Map();

  constructor(slug: string, data: Chapter[]) {
    this.slug = slug;
    this.data = data;

    data.forEach(chapter => {
      this._data.set(chapter.id, chapter);
    });
  }

  getChapter(id: string) {
    return this._data.get(id);
    // console.warn('in get chapter', id, this.data);
    // return this.data.find(chapter => chapter.id === id);
  }

  getWordCount() {
    return sumBy(
      this.data,
      (c: Chapter) => c.wordCount || 0
    );
  }

  async add(chapter: Chapter) {
    chapter.id = uuidv4();
    this._data.set(chapter.id, chapter);
    this.data.push(chapter);
    await createPost(chapter.book, chapter.id);
    await this.update();
    return chapter.id;
  }

  async remove(chapter: Chapter) {
    this.data = this.data.filter(item => item !== chapter);
    await removePost(chapter.book, chapter.id);
    return this.update();
  }

  toJson() {
    return this.data.map(chapter => chapter.toJson());
  }

  static async get(slug: string): Promise<Summary> {
    return fetch(slug).then(res => {
      const data = res.data.data.map(item => {
        return new Chapter(item);
      });
      return new Summary(slug, data);
    });
  }

  async update() {
    return update(this.slug, this.toJson());
  }
}