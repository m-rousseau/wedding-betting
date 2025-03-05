CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_type TEXT NOT NULL CHECK (answer_type IN ('multiple_choice', 'text')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    
);

-- Add comment to table
COMMENT ON TABLE public.questions IS 'Stores questions for wedding betting games';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS questions_game_id_idx ON public.questions (game_id); 