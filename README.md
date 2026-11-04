# Pustak - Personal Library Manager (Lab 7)

React (Vite) frontend + Express REST API. Books are stored in `server/data/books.json`.

## Run

    # backend
    cd server
    npm install
    npm start              # http://localhost:5000

    # frontend (new terminal, from project root)
    npm install
    npm run dev            # http://localhost:5173

Or run both together after installing both:  `npm run dev:all`

## API

| Method | Endpoint              | What it does                                   |
|--------|-----------------------|------------------------------------------------|
| GET    | /books                | list; supports q, genre, status, favorite, sort, order |
| GET    | /books/stats          | totals, average rating, pages read, genres     |
| GET    | /books/:id            | one book                                       |
| POST   | /books                | add a book                                     |
| PUT    | /books/:id            | update a book                                  |
| PATCH  | /books/:id/favorite   | toggle favourite                               |
| PATCH  | /books/:id/status     | change reading status                          |
| PATCH  | /books/:id/progress   | set current page; status updates automatically |
| DELETE | /books/:id            | delete a book                                  |
| POST   | /books/bulk-delete    | delete many: { "ids": [1,2] }                  |
