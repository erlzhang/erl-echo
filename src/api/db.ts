import Dexie from 'dexie';

const db = new Dexie('bookshelf-db');
db.version(1).stores({
  posts: '&id'
});

export default db;