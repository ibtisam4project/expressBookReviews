# Express Book Review Application

A robust RESTful server-side bookstore application built with **Node.js** and **Express.js**, developed for the **IBM Full Stack JavaScript Developer** final project.

---

## Description

The Express Book Review platform provides public access to explore books, search by ISBN, author, or title, and view book reviews. Registered and authenticated users can securely log in via JSON Web Tokens (JWT) and express session management to add, update, and delete their own book reviews.

---

## Technologies Used

* **Node.js**
* **Express.js**
* **Axios** (for async book retrieval and Promise/async-await operations)
* **JSON Web Tokens (JWT)** & **express-session** (for secure authentication)
* **JavaScript (ES6+)**

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ibm-developer-skills-network/expressBookReviews.git
   cd expressBookReviews/final_project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the server**:
   ```bash
   npm start
   ```
   *or*
   ```bash
   node index.js
   ```
   The server will start listening on port `5000`.

---

## Available API Endpoints

### Public Endpoints (General Routes)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieve the complete list of all books available in the shop |
| `GET` | `/isbn/:isbn` | Retrieve book details based on ISBN |
| `GET` | `/author/:author` | Retrieve all books by a specific author |
| `GET` | `/title/:title` | Retrieve all books matching a specific title |
| `GET` | `/review/:isbn` | Retrieve reviews for a specific book |
| `POST` | `/register` | Register a new user (`username`, `password`) |

### Protected Customer Endpoints (Authenticated Routes)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/customer/login` | Login as a registered user and obtain session authorization |
| `PUT` | `/customer/auth/review/:isbn` | Add or update a book review for the authenticated user |
| `DELETE` | `/customer/auth/review/:isbn` | Delete a book review posted by the authenticated user |

---

## Testing Examples (cURL)

### 1. Get All Books
```bash
curl http://localhost:5000/
```

### 2. Search Book by ISBN
```bash
curl http://localhost:5000/isbn/1
```

### 3. Search Books by Author
```bash
curl "http://localhost:5000/author/Chinua%20Achebe"
```

### 4. Search Books by Title
```bash
curl "http://localhost:5000/title/Things%20Fall%20Apart"
```

### 5. Get Book Reviews
```bash
curl http://localhost:5000/review/1
```

### 6. Register New User
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

### 7. User Login (Save Session)
```bash
curl -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'
```

### 8. Add or Update Review
```bash
curl -b cookies.txt -X PUT "http://localhost:5000/customer/auth/review/1?review=This%20is%20an%20outstanding%20book"
```

### 9. Delete Review
```bash
curl -b cookies.txt -X DELETE http://localhost:5000/customer/auth/review/1
```

---

## License

This project is licensed under the Apache License 2.0 as part of the IBM Skills Network curriculum.