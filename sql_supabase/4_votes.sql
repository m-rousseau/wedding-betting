CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add RLS policies later
    CONSTRAINT votes_unique_user_answer UNIQUE (user_id, answer_id)
);

-- Add comment to table
COMMENT ON TABLE public.votes IS 'Stores user votes on answers';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS votes_answer_id_idx ON public.votes (answer_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON public.votes (user_id); 