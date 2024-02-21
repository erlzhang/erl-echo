import JSZip from "jszip"
import fm from 'front-matter'
import markdownit from 'markdown-it'
import { getFileNameAndExt } from "./file";
import { Category, Status, WritingMode } from '@/models/book';
import db from "@/api/db";
import { getWordCount } from "./word";
import { CATEGORY } from "@/const/book";

export default class {
  file: any

  constructor(file: any) {
    this.file = file;
  }

  async load(): Promise<number> {
    const { name: bookSlug } = getFileNameAndExt(this.file.name);
    const zip = await JSZip.loadAsync(this.file);
    const getFiles: Promise<{
      name: string,
      content: string
    }>[] = [];
    zip.forEach((path, file) => {
      getFiles.push(new Promise((resolve) => {
        file.async('text')
        .then((content: string) => {
          resolve({
            name: file.name,
            content
          })
        })
      }))
    });

    let book = null;
    let chapters = [];
    
    return Promise.all(getFiles)
      .then(files => {
        files.forEach(({name, content}: {
          name: string,
          content: string
        }) => {
          const { name: slug, ext, parent } = getFileNameAndExt(name);
          if (ext !== 'md') {
            return;
          }

          const obj = fm(content);
          const post = {
            slug,
            parent,
            content: obj.body
          };

          Object.assign(post, obj.attributes);

          if (post.slug === 'index' && !parent) {
            // book
            book = post;
            book.slug = bookSlug;
          } else {
            chapters.push({
              ...post,
              index: post.index || 0.5
            })
          }
        });

        chapters.sort((a, b) => a.index - b.index);
        return this.import(book, chapters);
      });
  }

  async import(book, chapters): Promise<number> {
    const md = markdownit()
    return new Promise((resolve, reject) => {
      db.transaction('rw', [db.chapters, db.books, db.posts], async () => {
        let wordCount = 0;
        const tree: any = {
          children: []
        };
        Promise.all(chapters.map(async c => {
          const _wordCount = getWordCount(c.content);
          let slug = c.slug;
          let parent = c.parent;
          let volume = false;
          if (slug === 'index') {
            slug = c.parent;
            parent = '';
            volume = true;
          }
          const chapterId = await db.chapters.add({
            book: book.slug,
            title: c.title,
            slug,
            _parent: parent,
            volume,
            wordCount: _wordCount,
            level: parent ? 1 : 0
          });
          wordCount += _wordCount;
          db.posts.add({
            slug: `/${book.slug}${parent ? '/' + parent : ''}/${slug}`,
            content: this.getChapterContent(md.render(c.content))
          });
          if (parent) {
            if (!tree[parent]) {
              tree[parent] = [];
            }
            tree[parent].push(chapterId);
          } else {
            tree.children.push({
              id: chapterId,
              slug
            })
          }
          return chapterId;
        })).then(() => {
          const ids: number[] = [];
          tree.children.forEach((child: {
            id: Number,
            slug: String
          }) => {
            ids.push(child.id);
            if (tree[child.slug] && tree[child.slug].length) {
              ids.push(...tree[child.slug]);
            }
          })
          book.chapters = ids;
          book.wordCount = wordCount;
          book.status = Status.Published;
          book.writingMode = WritingMode.HandWriting;
          book.category = this.getCategory(book.category)
          book.updatedAt = new Date()
          db.books.add(book)
            .then((id: number) => resolve(id))
        }).catch(err => reject(err))
      })
    })
  }

  getChapterContent(content: string) {
    return content.replaceAll('/img/', 'https://erlim.oss-cn-hongkong.aliyuncs.com/img/');
  }

  getCategory(cat: string): Category {
    for (let key in CATEGORY) {
      if (CATEGORY[key] === cat) {
        return Number(key);
      }
    }

    return Category.Eassy;
  }
}