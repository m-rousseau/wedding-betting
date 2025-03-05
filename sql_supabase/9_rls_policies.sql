-- Enable Row Level Security on all tables
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "Anyone can view active games"
ON public.games FOR SELECT
USING (status = 'active');

-- Questions policies
CREATE POLICY "Anyone can view questions"
ON public.questions FOR SELECT
USING (true);

-- Answers policies
CREATE POLICY "Users can view all answers"
ON public.answers FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own answers"
ON public.answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
ON public.answers FOR UPDATE
USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Users can view all votes"
ON public.votes FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own votes"
ON public.votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
ON public.votes FOR DELETE
USING (auth.uid() = user_id);

-- Chat rooms policies
CREATE POLICY "Users can view public chat rooms"
ON public.chat_rooms FOR SELECT
USING (is_private = false);

CREATE POLICY "Users can view private chat rooms they are in"
ON public.chat_rooms FOR SELECT
USING (
  is_private = true AND 
  participants::jsonb ? auth.uid()::text
);

CREATE POLICY "Users can create chat rooms"
ON public.chat_rooms FOR INSERT
WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view messages in rooms they have access to"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_rooms
    WHERE id = room_id AND (
      is_private = false OR
      participants::jsonb ? auth.uid()::text
    )
  )
);

CREATE POLICY "Users can insert their own messages"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.chat_rooms
    WHERE id = room_id AND (
      is_private = false OR
      participants::jsonb ? auth.uid()::text
    )
  )
);

-- Polls policies
CREATE POLICY "Anyone can view polls"
ON public.polls FOR SELECT
USING (true);

-- Poll votes policies
CREATE POLICY "Users can view all poll votes"
ON public.poll_votes FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own poll votes"
ON public.poll_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own poll votes"
ON public.poll_votes FOR UPDATE
USING (auth.uid() = user_id); 