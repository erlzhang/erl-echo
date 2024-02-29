import Chapter from './chapter';
import Base from './base';

import {
  create,
  fetch,
  fetchList,
  update,
  remove
} from '@/api/books';

// import db from '@/api/db';

export enum Status {
  New, // 构思
  Writing, // 写作中
  Finished, // 初稿完成
  Modifying, // 录入 + 修改
  Published // 已发布
};

export enum Category {
  Eassy,
  Novel
};

export enum WritingMode {
  HandWriting, // 手写
  Type, // 码字
}

class Book extends Base {
  index:number=0;
  slug:string = "";
  title:string = "";
  content:string = "";
  status:Status = Status.New;
  start:number|null = null;
  end:number|null = null;
  category:Category = Category.Eassy;
  wordCount:number = 0;
  writingMode: WritingMode = WritingMode.HandWriting;
  updatedAt:Date = new Date();

  _summary: Chapter[] = [];

  get path(): string {
    return `/${this.slug}/index`
  }

  get date(): string {
    if (!this.start) {
      return '';
    } else if (!this.end) {
      return this.start + '';
    } else if (this.start === this.end) {
      return this.end + '';
    } else {
      return `${this.start}-${this.end}`;
    }
  }

  get summary() {
    return this._summary;
  }

  get hasSummary() {
    if (this.writingMode === WritingMode.HandWriting) {
      return this.status > Status.Finished;
    } else if (this.writingMode === WritingMode.Type) {
      return this.status > Status.New;
    }

    return false;
  }

  constructor(obj) {
    super()

    this.fromJson(obj);
  }

  async update(obj) {
    Object.assign(this, obj);
    return update(this.slug, obj)
      .then(() => {
        return this;
      });
    // db.books.update(this.id, obj);
  }

  setStatus(target: Status) {
    this.update({
      status: target
    });
  }

  clone() {
    const book = new Book(this.slug);
    Object.getOwnPropertyNames(this).forEach(item => {
      book[item] = this[item];
    });
    return book;
  }

  async remove() {
    return remove(this.slug);
  }

  static async new(form: any): Promise<Book> {
    const book = new Book(form);
    return create(book.toJson())
      .then(res => {
        return book;
      });
  }

  static async list(): Promise<Book[]> {
    return fetchList().then(res => {
      return res.data.data.map(item => {
        return new Book(item);
      });
    });
  }

  static async get(slug: string): Promise<Book> {
    return fetch(slug).then(res => {
      return new Book(res.data.data);
    });
  }
}

export default Book;