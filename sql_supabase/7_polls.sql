CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add RLS policies later
    CONSTRAINT polls_options_not_empty CHECK (jsonb_array_length(options) >= 2)
);

-- Add comment to table
COMMENT ON TABLE public.polls IS 'Stores polls for wedding games';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS polls_game_id_idx ON public.polls (game_id);
CREATE INDEX IF NOT EXISTS polls_status_idx ON public.polls (status); 