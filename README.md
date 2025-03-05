# Wedding Betting App

A mobile application that allows wedding guests to participate in fun betting games based on wedding-related outcomes and interact via real-time chat rooms.

## Features

- **User Authentication**: Sign up and login functionality with profile creation
- **Game Management**: Create, join, and participate in wedding betting games
- **Real-time Chat**: Open group chats and private messaging
- **Polls**: Create and vote on polls related to wedding events
- **Countdown Timers**: Track time until answer submission deadlines
- **Voting System**: Vote on correct answers after submission deadline

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Authentication, Database, Storage, Real-time)
- **State Management**: React Hooks
- **Navigation**: React Navigation
- **UI Components**: Custom components with consistent styling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (https://supabase.com)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wedding-betting.git
   cd wedding-betting
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Supabase project:
   - Sign up for a Supabase account at https://supabase.com
   - Create a new project
   - Set up the database tables according to the schema in the project documentation
   - Get your Supabase URL and anon key from the project settings

4. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
   ```
   npm start
   ```

6. Use the Expo Go app on your mobile device to scan the QR code, or run on an emulator.

### Database Setup

Create the following tables in your Supabase project:

1. **games**
   - id (uuid, primary key)
   - name (text)
   - timer_end (timestamp)
   - status (text, 'active' or 'ended')
   - confirmed_winners (json, array of user IDs)
   - created_at (timestamp)

2. **questions**
   - id (uuid, primary key)
   - game_id (uuid, foreign key to games)
   - question_text (text)
   - answer_type (text, 'multiple_choice' or 'text')
   - created_at (timestamp)

3. **answers**
   - id (uuid, primary key)
   - question_id (uuid, foreign key to questions)
   - user_id (uuid, foreign key to auth.users)
   - answer_text (text, nullable)
   - choice (text, nullable)
   - created_at (timestamp)

4. **votes**
   - id (uuid, primary key)
   - answer_id (uuid, foreign key to answers)
   - user_id (uuid, foreign key to auth.users)
   - created_at (timestamp)

5. **chat_rooms**
   - id (uuid, primary key)
   - name (text)
   - is_private (boolean)
   - participants (json, array of user IDs, nullable)
   - created_at (timestamp)

6. **messages**
   - id (uuid, primary key)
   - room_id (uuid, foreign key to chat_rooms)
   - user_id (uuid, foreign key to auth.users)
   - content (text)
   - photo_url (text, nullable)
   - timestamp (timestamp)

7. **polls**
   - id (uuid, primary key)
   - game_id (uuid, foreign key to games)
   - question_text (text)
   - options (json, array of strings)
   - status (text, 'active' or 'closed')
   - created_at (timestamp)

8. **poll_votes**
   - id (uuid, primary key)
   - poll_id (uuid, foreign key to polls)
   - user_id (uuid, foreign key to auth.users)
   - option (text)
   - created_at (timestamp)

### Storage Buckets

Create the following storage buckets in your Supabase project:

1. **selfies** - For user profile pictures
2. **chat_photos** - For photos shared in chat messages

## Project Structure

```
src/
├── components/       # Reusable UI components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # Screen components
│   ├── auth/         # Authentication screens
│   ├── games/        # Game-related screens
│   ├── chat/         # Chat-related screens
│   └── main/         # Main app screens
├── services/         # API service functions
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Components

- **Authentication**: Email/password authentication with Supabase
- **Game Management**: Create questions, set timers, and manage voting
- **Chat System**: Real-time messaging with Supabase subscriptions
- **Poll System**: Create polls and collect votes from participants

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Supabase for providing the backend infrastructure
- React Native and Expo for the mobile development framework
- All contributors who have helped shape this project
