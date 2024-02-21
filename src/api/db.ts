import Dexie from 'dexie';

// import Book from '../models/book';
// import Chapter from '../models/chapter';

const db = new Dexie('bookshelf-db');
db.version(1).stores({
  books: '++id, &slug, status', // Primary key and indexed props
  chapters: '++id, book, slug, [book+slug]',
  posts: '++id, &slug'
});

export default db;

// db.books.mapToClass(Book);

// db.chapters.mapToClass(Chapter);

// export const addBook = async (book : Book) => {
//   await db.books.add(book);
// }

// export const getBooks = async () => {
//   return db.books.toArray();
// }

// const getChaptersOfBook = async (book: string) => {
//   return db.chapters.where('book').equals(book).toArray();
// }

// export const getBook = async (name: string) => {
//   console.warn('in get book', name);
//   const book: Book = await db.books.where('name').equals(name).first();
//   const chapters: Chapter[] = await getChaptersOfBook(name);
//   book.setChapters(chapters);
//   return book;
// }

// export const putBook = async (form : Book) => {
//   console.warn('in put book', form);
//   await db.books.put(form);
// }

// export const addChapter = async (form : Chapter) => {
//   await db.chapters.add(form);
// }

// export const getChapter = async (book:string, slug : string) => {
//   // await db.chapters.where({book: book, slug: slug}).first();
//   const chapter = await db.chapters.where('[book+slug]').equals([book, slug]).first()
//   const post = await db.posts.where('slug').equals(chapter.postSlug).first();
//   chapter.content = post.content;
// }

// export const putChapter = async (form : Chapter) => {
//   await db.chapters.put(form);
// }