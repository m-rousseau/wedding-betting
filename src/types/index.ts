import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with our custom fields
export interface User extends SupabaseUser {
  email: string;
  user_metadata: {
    name: string;
    selfie_url?: string;
  };
}

export type Game = {
  id: string;
  name: string;
  timer_end: string;
  status: 'active' | 'ended';
  confirmed_winners: string[] | null;
};

export type Question = {
  id: string;
  game_id: string;
  question_text: string;
  answer_type: 'multiple_choice' | 'text';
};

export type Answer = {
  id: string;
  question_id: string;
  user_id: string;
  answer_text?: string;
  choice?: string;
};

export type Vote = {
  id: string;
  answer_id: string;
  user_id: string;
};

export type ChatRoom = {
  id: string;
  name: string;
  is_private: boolean;
  participants: string[];
};

export type Message = {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  timestamp: string;
  photo_url?: string;
};

export type Poll = {
  id: string;
  game_id: string;
  question_text: string;
  options: string[];
  status: 'active' | 'closed';
};

export type PollVote = {
  id: string;
  poll_id: string;
  user_id: string;
  option: string;
};

export type CustomError = {
  error: {
    code: string;
    message: string;
    details?: string;
  };
};

export type Session = {
  access_token: string;
  refresh_token: string;
};

export type AuthResponse = {
  user: User;
  session: Session;
};

export type GameWithQuestions = Game & {
  questions: Question[];
};

export type QuestionWithAnswers = Question & {
  answers: (Answer & { votes: number })[];
};

export type GameResults = {
  game: Game & { confirmed_winners: string[] };
  questions: QuestionWithAnswers[];
};

export type PollResults = {
  poll: Poll;
  results: Record<string, number>;
}; 