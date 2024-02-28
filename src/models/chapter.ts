import { v4 as uuidv4 } from 'uuid';
import Base from './base';
import {
  fetch,
  update
} from '@/api/posts';

function getPath(slug: string) {
  if (this.parent) {
    return `/${this.book}/${this.parent}/${slug}`;
  } else {
    return `/${this.book}/${slug}`;
  }
}

class Chapter extends Base {
  id:string = "";
  book:string = "";
  slug:string = "";
  title:string = "";
  wordCount: number = 0;
  // children:Array<Chapter> = [];
  updatedAt: Date = new Date();
  level: number = 0;
  // parent:string = "";
  // volume: boolean = false;

  get path(): string {
    return `/${this.book}/${this.slug}`;
  }

  constructor(obj) {
    super()

    this.fromJson(obj);
  }

  update(obj: any) {
    Object.assign(this, obj);
    // db.chapters.update(this.id, obj);
  }

  async save(): Promise {
    return db.chapters.put(this);
  }

  async getContent(): Promise<string> {
    return fetch(this.book, this.id)
      .then(res => {
        return res.data.data;
      })
  }

  async saveContent(content: string): Promise<any> {
    return update(this.book, this.id, content);
  }

  static async new(slug: string, book: string): Promise<Chapter> {
    const id = uuidv4();
    return new Chapter({
      slug,
      book,
      id
    });
  }

  clone(): Chapter {
    const chapter = new Chapter(this.slug, this.book);
    Object.getOwnPropertyNames(this).forEach(item => {
      chapter[item] = this[item];
    });
    return chapter;
  }
}

export default Chapter;