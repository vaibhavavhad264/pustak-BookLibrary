// Tiny file based "database". Every read/write goes to data/books.json
// so the data survives a server restart.
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "data", "books.json");

function readBooks() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch (err) {
    return [];
  }
}

function writeBooks(books) {
  fs.writeFileSync(DB_FILE, JSON.stringify(books, null, 2));
}

function nextId(books) {
  return books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
}

module.exports = { readBooks, writeBooks, nextId };
