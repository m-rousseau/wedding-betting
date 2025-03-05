# Supabase SQL Setup Files

This directory contains SQL files to set up the database schema for the Wedding Betting app in Supabase.

## Files

1. `1_games.sql` - Creates the games table
2. `2_questions.sql` - Creates the questions table
3. `3_answers.sql` - Creates the answers table
4. `4_votes.sql` - Creates the votes table
5. `5_chat_rooms.sql` - Creates the chat_rooms table
6. `6_messages.sql` - Creates the messages table
7. `7_polls.sql` - Creates the polls table
8. `8_poll_votes.sql` - Creates the poll_votes table
9. `9_rls_policies.sql` - Sets up Row Level Security policies
10. `10_storage_setup.sql` - Creates storage buckets and policies

## How to Use

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query
4. Copy and paste each SQL file content into the editor
5. Run the queries in numerical order (1-10)

## Important Notes

- Run the files in order, as later tables depend on earlier ones
- The RLS policies (file 9) should be run after all tables are created
- The storage setup (file 10) creates buckets for storing user selfies and chat photos

## Schema Overview

- **games** - Stores wedding betting games
- **questions** - Stores questions for games
- **answers** - Stores user answers to questions
- **votes** - Stores user votes on answers
- **chat_rooms** - Stores chat rooms
- **messages** - Stores chat messages
- **polls** - Stores polls for games
- **poll_votes** - Stores user votes on polls

## Storage Buckets

- **selfies** - For user profile pictures
- **chat_photos** - For photos shared in chat messages 