# Testing TaskFlow in Postman

Base URL: `http://localhost:5000/api`
Every request with a body: set Body -> raw -> JSON (Postman adds `Content-Type: application/json`).
Protected routes also need the header `Authorization: Bearer <token>` (or Authorization tab -> Bearer Token).

Test in this order. Errors always look like `{ "message": "..." }`.

## 1. Register - POST /auth/register
Body: `{ "name": "Uttkarsh", "email": "u@example.com", "password": "password123" }`
- 201 `{ "message": "Account created. You can log in now." }`
- 400 missing fields / bad email / password under 8 characters
- 409 email already registered

## 2. Login - POST /auth/login
Body: `{ "email": "u@example.com", "password": "password123" }`
- 200 `{ "token": "eyJ...", "user": { "id": 1, "name": "Uttkarsh", "email": "u@example.com" } }`
- 401 `Incorrect email or password.`
Copy the token and use it in every request below.

## 3. Current user - GET /auth/me
Header: Authorization: Bearer <token>
- 200 `{ "user": { "id": 1, "name": "Uttkarsh", "email": "u@example.com" } }`
- 401 no token, or an invalid / expired token

## 4. Create task - POST /tasks
Body: `{ "title": "Send proposal", "description": "", "dueDate": "2026-11-08", "priority": "High", "status": "Pending" }`
- 201 `{ "id": 1, "title": "Send proposal", "description": "", "dueDate": "2026-11-08", "priority": "High", "status": "Pending" }`
- 400 empty title, priority not Low/Medium/High, status not Pending/In Progress/Completed, bad date
- `dueDate` can be `null` or left out

## 5. List tasks - GET /tasks
- 200 array of your tasks only

## 6. Update task - PUT /tasks/1
Body: same fields as create, with your changes (all of title, priority and status are required).
- 200 the updated task
- 404 `Task not found.` (wrong id, or the task belongs to someone else)

## 7. Delete task - DELETE /tasks/1
- 200 `{ "message": "Task deleted." }`
- 404 `Task not found.`

## 8. Dashboard - GET /tasks/dashboard
- 200 `{ "total": 4, "pending": 2, "inProgress": 1, "completed": 1, "highPriorityTasks": [ ...max 5 tasks... ] }`
- High-priority list: High priority, not Completed, nearest due date first, no date last.

## 9. Check users cannot see each other's tasks
1. Register and log in a second user (user B), copy B's token.
2. Create a task as user A, note its id.
3. As user B: GET /tasks returns `[]`, and PUT or DELETE /tasks/<A's id> returns 404.
