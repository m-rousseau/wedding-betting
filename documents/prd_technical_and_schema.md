# Enhanced Technical Specifications Document for Wedding Guest App

## 1. Introduction

### Purpose of the App:

This mobile application enables wedding guests to participate in a fun betting game based on wedding-related outcomes (e.g., "Who will cry first?" or "How many Taylor Swift songs will be played?") and interact via real-time chat rooms. The app enhances guest engagement and provides an interactive experience during wedding events.

### Target Audience:

Wedding guests, with an initial user base of approximately 75 individuals per event, now scalable to support larger gatherings (e.g., 200+ users).

### Key Features:

- Game creation and management by administrators.
- User onboarding with profile creation (name and selfie).
- Timed question-and-answer game with voting on outcomes.
- Real-time chat functionality (open and private rooms).
- Admin controls for managing games and enforcing data retention policies.
- In-app notifications for game updates and chat activity.
- Advanced analytics for user engagement, retention, and funnel analysis.
- Automated testing for reliability and maintainability.
- New: Live polls and photo sharing in chats for increased interactivity.

## 2. Technology Stack

- Frontend: React Native (cross-platform mobile app development for iOS and Android).
- Backend: Supabase (Postgres database, authentication, storage, real-time subscriptions, Edge Functions).
- Additional Tools:
  - Expo (for push notifications and deep linking).
  - Google Analytics for Firebase (for advanced user engagement tracking).
  - Sentry (for error tracking and crash reporting).
  - Jest (for unit testing).
  - Detox (for end-to-end testing).
  - New: GitHub Actions (for CI/CD pipeline automation).

## 3. Database Schema

The app uses a Postgres database managed by Supabase. The schema remains largely unchanged but includes optimizations and new tables for added features.

### Tables

- Users: Stores user profiles.
  - id (UUID, primary key)
  - name (text)
  - selfie_url (text, URL to stored selfie in Supabase Storage)
  - role (text, 'admin' or 'guest')
  - created_at (timestamp)
- Games: Represents individual betting games.
  - id (UUID, primary key)
  - name (text)
  - timer_end (timestamp)
  - status (text, 'active' or 'ended')
  - confirmed_winners (JSON or array, stores IDs of winning users)
- Questions: Contains game questions.
  - id (UUID, primary key)
  - game_id (UUID, foreign key to Games)
  - question_text (text)
  - answer_type (text, 'multiple_choice' or 'text')
- Answers: Stores user responses to questions.
  - id (UUID, primary key)
  - question_id (UUID, foreign key to Questions)
  - user_id (UUID, foreign key to Users)
  - answer_text (text) or choice (text)
- Votes: Tracks votes on answers.
  - id (UUID, primary key)
  - answer_id (UUID, foreign key to Answers)
  - user_id (UUID, foreign key to Users)
- Chat Rooms: Manages chat rooms.
  - id (UUID, primary key)
  - name (text)
  - is_private (boolean)
  - participants (array of UUIDs)
- Messages: Stores chat messages.
  - id (UUID, primary key)
  - room_id (UUID, foreign key to Chat Rooms)
  - user_id (UUID, foreign key to Users)
  - content (text)
  - timestamp (timestamp)
  - photo_url (text, optional URL to stored photo in Supabase Storage)
- New - Polls: Stores live polls for interactive engagement.
  - id (UUID, primary key)
  - game_id (UUID, foreign key to Games)
  - question_text (text)
  - options (JSON, array of poll options)
  - status (text, 'active' or 'closed')
- New - Poll Votes: Tracks user votes on polls.
  - id (UUID, primary key)
  - poll_id (UUID, foreign key to Polls)
  - user_id (UUID, foreign key to Users)
  - option (text, selected poll option)

### Relationships

- A Game has multiple Questions and Polls.
- Each Question has multiple Answers; each Poll has multiple Poll Votes.
- Each Answer can receive multiple Votes.
- Chat Rooms contain multiple Messages, now with optional photos.

### Indexes

- Existing: 
  - users.id, 
  - games.id, 
  - questions.game_id, 
  - answers.question_id, 
  - etc.
- New:
  - polls.game_id, 
  - polls.status
  - poll_votes.poll_id, 
  - poll_votes.user_id
  - messages.photo_url (for efficient photo retrieval)

### Row Level Security (RLS) Policies

- Users access only Games and Polls they are linked to.
- Only admins modify Games, Questions, and Polls, and confirm winners.
- Messages and Polls are accessible only to authorized participants.
- Optimized RLS uses indexed columns for performance.

## 4. System Architecture

Frontend: React Native with @supabase/supabase-js for Supabase integration.

Backend: Supabase provides:
  - Postgres database.
  - Authentication (email/password).
  - Storage for selfies, chat photos, and poll-related media.
  - Real-time subscriptions for chat and live polls.
  - Edge Functions for data deletion and poll management.

Authentication Flow: JWT-based via Supabase Auth.

Real-Time Features: Subscriptions to Messages and Polls tables.

Polling: Votes and poll results polled every 5 seconds.

Notifications:
  - Expo Push Notifications for chat and game events.
  - In-app notifications for game updates, poll status, and chat activity.

Analytics:
  - Google Analytics for Firebase tracks retention, funnels, and custom events (e.g., poll participation).
  - Sentry monitors errors and crashes.

Testing:
  - Jest (unit)
  - Detox (end-to-end)

New - CI/CD: GitHub Actions automates testing, building, and deployment.

Data Flow Example: Game Participation with Polls
  - User joins a game via a share link.
  - App queries Games, Questions, and Polls tables.
  - User submits an Answer and votes in a Poll before deadlines.
  - Receives in-app notifications for submissions and poll status changes.
  - Post-timer, app polls Votes and Poll Votes for updates.

Data Flow Example: Chat with Photos
  - User joins a chat room.
  - Sends a message with an optional photo (uploaded to Supabase Storage).
  - Messages update in real-time; in-app notifications alert for unread messages.

Data Deletion Flow
  - Edge Function runs daily:
    - Deletes Messages and Poll Votes older than 72 hours.
    - Removes selfies and chat photos from Storage after 72 hours.

Enhancements Implementation
  - Scalability Beyond 75 Users
    - Purpose: Support larger events (e.g., 200+ users).
    - Approach:
      - Upgrade to Supabase Pro tier for higher database bandwidth and storage (if needed).
      - Optimize real-time subscriptions to reduce server load (e.g., selective channels).
      - Compress uploaded media (selfies, chat photos) to minimize storage usage.

Feature Expansion: Live Polls and Photo Sharing
  - Live Polls:
    - Admins create polls linked to games (e.g., "What’s the best dance move tonight?").
    - Users vote in real-time; results update via subscriptions.
    - In-app notifications alert when polls open/close.
  - Photo Sharing in Chats:
    - Users upload photos to Storage; photo_url added to Messages.
    - Photos are private, accessible via signed URLs with RLS.

CI/CD Pipeline
  - Purpose: Streamline updates and ensure reliability.
  - Approach:
    - Use GitHub Actions to:
      - Run Jest and Detox tests on each pull request.
      - Build and deploy app updates to Expo EAS (Expo Application Services).
      - Automate version releases and changelog generation.

## 5. Control Flow

User Onboarding
  - User signs up/logs in via share link, creates profile, and joins game.

Game Participation
  - User answers questions, votes in polls, and receives in-app notifications for key events.

Chat Functionality
  - User joins rooms, sends messages/photos, and gets real-time updates.

Admin Controls
  - Admins manage games, questions, polls, and confirm outcomes.

## 6. Non-Functional Requirements

- Performance: Supports 200+ concurrent users with optimized queries and subscriptions.
- Scalability: Upgraded Supabase tier and media compression handle larger events.
- Security: RLS, HTTPS, JWT, and signed URLs ensure data privacy.
- Cost: Free tiers initially; Pro tier if usage exceeds limits.
- User Experience: Enhanced with polls, photo sharing, and notifications.
- Maintainability: CI/CD and automated testing ensure reliability.

## 7. Trade-off Analysis

Pros
  - Scalability: Ready for larger events with minimal adjustments.
  - Engagement: Polls and photo sharing boost interactivity.
  - Efficiency: CI/CD reduces manual effort and errors.

Cons
  - Cost: Pro tier may incur fees for large events.
  - Complexity: New features and CI/CD add setup time.

Potential Bottlenecks
  - Storage: Increased media uploads require monitoring.
  - Real-Time Load: High subscription usage could strain Supabase free tier.