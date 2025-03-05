# API Endpoints
The app uses Supabase via the @supabase/supabase-js client. Real-time updates are implemented only for chat messages; all other features use periodic polling (5-second intervals). File uploads are limited to 1MB with compression applied. Custom error responses are defined for each endpoint.

## Custom Error Response Format
All error responses follow this structure:

```json
{
  "error": {
    "code": "string",  // Unique error identifier
    "message": "string",  // Human-readable description
    "details": "string"  // Optional additional info
  }
}
```

## Authentication Endpoints

### Endpoint 1: Sign Up

- Method: POST
- URL: /auth/signup (Supabase Auth API)
- Request:
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "selfie": "file"  // Optional, max 1MB after compression
}
```
Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "selfie_url": "string"
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```
Error Responses:
- 400-INVALID-INPUT: "Invalid email, password, or name format."
- 413-FILE-TOO-LARGE: "Selfie exceeds 1MB limit after compression."
- 409-USER-EXISTS: "Email already registered."
- 500-SERVER-ERROR: "Failed to create user due to server issue."

Logic and Control Flow:
- Validate email, password, and name (non-empty, valid formats).
- If selfie provided, compress to ensure size ≤ 1MB using imageCompression.js.
- Call supabase.auth.signUp() to register the user.
- Upload compressed selfie to Supabase Storage (users/selfies/) and get public URL.
- Insert user details into Users table.
- Return user and session data or appropriate error.

### Endpoint 2: Log In
- Method: POST
- URL: /auth/login (Supabase Auth API)
- Request:
```json
{
  "email": "string",
  "password": "string"
}
```
- Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "selfie_url": "string"
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```
Error Responses:
- 400-INVALID-INPUT: "Invalid email or password format."
- 401-UNAUTHORIZED: "Incorrect email or password."
- 500-SERVER-ERROR: "Login failed due to server issue."

Logic and Control Flow:
- Validate email and password.
- Call supabase.auth.signInWithPassword() to authenticate.
- Fetch user details from Users table using returned ID.
- Return user and session data or error.

### Endpoint 3: Get User Profile
- Method: GET
- URL: /auth/profile (Supabase Database API)
- Request: None (JWT authenticated)
- Response:
```json
{
  "id": "uuid",
  "name": "string",
  "selfie_url": "string",
  "role": "string"
}
```
Error Responses:
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 404-NOT-FOUND: "User profile not found."
- 500-SERVER-ERROR: "Failed to fetch profile due to server issue."

Logic and Control Flow:
- Extract user ID from JWT.
- Query supabase.from('users').select('*').eq('id', userId).
- Return profile data or error.

## Game Endpoints

### Endpoint 4: Create Game (Admin)
- Method: POST
- URL: /games (Supabase Database API)
- Request:
```json
{
  "name": "string",
  "timer_end": "timestamp",
  "questions": [
    {
      "question_text": "string",
      "answer_type": "string"
    }
  ]
}
```
- Response:
```json
{
  "id": "uuid",
  "name": "string",
  "timer_end": "timestamp",
  "status": "active",
  "questions": [
    {
      "id": "uuid",
      "question_text": "string",
      "answer_type": "string"
    }
  ]
}
```
Error Responses:
- 400-INVALID-INPUT: "Missing or invalid game name, timer, or questions."
- 403-FORBIDDEN: "User lacks admin privileges."
- 500-SERVER-ERROR: "Failed to create game due to server issue."

Logic and Control Flow:
- Verify admin role via JWT.
- Validate input fields.
- Insert game into Games table.
- Insert questions into Questions table, linking to game ID.
- Return game and questions or error.

### Endpoint 5: Get Active Games
- Method: GET
- URL: /games/active (Supabase Database API)
- Request: None
- Response:
```json
[
  {
    "id": "uuid",
    "name": "string",
    "timer_end": "timestamp",
    "status": "active"
  }
]
```
Error Responses:
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 500-SERVER-ERROR: "Failed to fetch games due to server issue."

Logic and Control Flow:
- Query supabase.from('games').select('*').eq('status', 'active').
- Apply RLS to filter accessible games.
- Return active games or error.

### Endpoint 6: Submit Answer
- Method: POST
- URL: /answers (Supabase Database API)
- Request:
```json
{
  "question_id": "uuid",
  "answer_text": "string"  // or "choice": "string"
}
```
- Response:
```json
{
  "id": "uuid",
  "question_id": "uuid",
  "user_id": "uuid",
  "answer_text": "string"  // or "choice": "string"
}
```
Error Responses:
- 400-INVALID-INPUT: "Invalid question ID or answer format."
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 403-TIMER-EXPIRED: "Game timer has expired."
- 500-SERVER-ERROR: "Failed to submit answer due to server issue."

Logic and Control Flow:
- Verify user authentication.
- Check game timer_end via Questions and Games tables.
- Insert answer into Answers table.
- Return answer data or error.

### Endpoint 7: Submit Vote
- Method: POST
- URL: /votes (Supabase Database API)
- Request:
```json
{
  "id": "uuid",
  "question_id": "uuid",
  "user_id": "uuid",
  "answer_text": "string"  // or "choice": "string"
}
```
Error Responses:
- 400-INVALID-INPUT: "Invalid question ID or answer format."
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 403-TIMER-EXPIRED: "Game timer has expired."
- 500-SERVER-ERROR: "Failed to submit answer due to server issue."

Logic and Control Flow:
- Verify user authentication.
- Check game timer_end via Questions and Games tables.
- Insert answer into Answers table.
- Return answer data or error.

### Endpoint 8: Get Game Results
- Method: GET
- URL: /games/:id/results (Supabase Database API)
- Request: None
- Response:
```json
{
  "game": {
    "id": "uuid",
    "name": "string",
    "status": "ended",
    "confirmed_winners": ["uuid"]
  },
  "questions": [
    {
      "id": "uuid",
      "question_text": "string",
      "answers": [
        {
          "id": "uuid",
          "answer_text": "string",
          "votes": 5
        }
      ]
    }
  ]
}
```
Error Responses:
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 404-NOT-FOUND: "Game not found."
- 500-SERVER-ERROR: "Failed to fetch results due to server issue."

Logic and Control Flow:
- Query Games, Questions, Answers, and Votes tables with joins.
- Aggregate vote counts for each answer.
- Return game results or error.
- Polled every 5 seconds on the client side.

## Chat Endpoints

### Endpoint 9: Create Chat Room
- Method: POST
- URL: /chat-rooms (Supabase Database API)
- Request:
```json
{
  "name": "string",
  "is_private": true,
  "participants": ["uuid"]
}
```
- Response:
```json
{
  "name": "string",
  "is_private": true,
  "participants": ["uuid"]
}
```
Error Responses:
- 400-INVALID-INPUT: "Missing or invalid name or participants."
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 500-SERVER-ERROR: "Failed to create chat room due to server issue."

Logic and Control Flow:
- Verify user authentication.
- Insert chat room into Chat Rooms table.
- Return chat room data or error.

### Endpoint 10: Send Message
- Method: POST
- URL: /messages (Supabase Database API)
- Request:
```json
{
  "room_id": "uuid",
  "content": "string",
  "photo": "file"  // Optional, max 1MB after compression
}
```
- Response:
```json
{
  "id": "uuid",
  "room_id": "uuid",
  "user_id": "uuid",
  "content": "string",
  "photo_url": "string"
}
```
Error Responses:
- 400-INVALID-INPUT: "Invalid room ID or content."
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 403-FORBIDDEN: "User not authorized for this room."
- 413-FILE-TOO-LARGE: "Photo exceeds 1MB limit after compression."
- 500-SERVER-ERROR: "Failed to send message due to server issue."

Logic and Control Flow:
- Verify user authentication and room access via RLS.
- If photo provided, compress to ≤ 1MB and upload to Supabase Storage (chat/photos/).
- Insert message into Messages table.
- Trigger push notification via Edge Function.
- Update in real-time via Supabase subscription.
- Return message data or error.

### Endpoint 11: Get Chat Messages
- Method: GET
- URL: /chat-rooms/:id/messages (Supabase Database API)
- Request: None
- Response:
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "content": "string",
    "photo_url": "string",
    "timestamp": "timestamp"
  }
]
```
Error Responses:
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 403-FORBIDDEN: "User not authorized for this room."
- 404-NOT-FOUND: "Chat room not found."
- 500-SERVER-ERROR: "Failed to fetch messages due to server issue."

Logic and Control Flow:
- Query supabase.from('messages').select('*').eq('room_id', roomId).order('timestamp', { ascending: true }).
- Apply RLS for access control.
- Return messages or error.
- Real-time updates via subscription.

## Poll Endpoints

### Endpoint 12: Create Poll (Admin)
- Method: POST
- URL: /polls (Supabase Database API)
- Request:
```json
{
  "game_id": "uuid",
  "question_text": "string",
  "options": ["string"]
}
```
- Response:
```json
{
  "id": "uuid",
  "game_id": "uuid",
  "question_text": "string",
  "options": ["string"],
  "status": "active"
}
```
Error Responses:
- 400-INVALID-INPUT: "Missing or invalid game ID, question, or options."
- 403-FORBIDDEN: "User lacks admin privileges."
- 500-SERVER-ERROR: "Failed to create poll due to server issue."

Logic and Control Flow:
- Verify admin role via JWT.
- Insert poll into Polls table.
- Return poll data or error.

### Endpoint 13: Submit Poll Vote
- Method: POST
- URL: /poll-votes (Supabase Database API)
- Request:
```json
{
  "poll_id": "uuid",
  "option": "string"
}
```
- Response:
```json
{
  "id": "uuid",
  "poll_id": "uuid",
  "user_id": "uuid",
  "option": "string"
}
```
Error Responses:
- 400-INVALID-INPUT: "Invalid poll ID or option."
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 403-POLL-CLOSED: "Poll is no longer active."
- 500-SERVER-ERROR: "Failed to submit vote due to server issue."

Logic and Control Flow:
- Verify user authentication.
- Check poll status is 'active'.
- Insert vote into Poll Votes table.
- Return vote data or error.

### Endpoint 14: Get Poll Results
- Method: GET
- URL: /polls/:id/results (Supabase Database API)
- Request: None
- Response:
```json
{
  "poll": {
    "id": "uuid",
    "question_text": "string",
    "options": ["string"]
  },
  "results": {
    "option1": 10,
    "option2": 5
  }
}
```
Error Responses:
- 401-UNAUTHORIZED: "Invalid or missing authentication token."
- 404-NOT-FOUND: "Poll not found."
- 500-SERVER-ERROR: "Failed to fetch results due to server issue."

Logic and Control Flow:
- Query Polls and Poll Votes tables with aggregation.
- Return poll details and vote counts or error.
- Polled every 5 seconds on the client side.

## Notes on Updates
- Real-Time Features: Limited to chat messages (/messages and /chat-rooms/:id/messages) using Supabase subscriptions. All other endpoints (e.g., votes, poll results) use 5-second polling.
- File Size Limits: Selfies and chat photos are compressed to ≤ 1MB using imageCompression.js (e.g., with react-native-image-resizer).
- Scalability: Designed for ≤ 200 users, fitting within Supabase free tier.
- Custom Errors: Defined for all endpoints, covering input validation, authorization, and server issues.