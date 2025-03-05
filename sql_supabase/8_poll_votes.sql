CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    option TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add RLS policies later
    CONSTRAINT poll_votes_unique_user_poll UNIQUE (user_id, poll_id)
);

-- Add comment to table
COMMENT ON TABLE public.poll_votes IS 'Stores user votes on polls';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS poll_votes_poll_id_idx ON public.poll_votes (poll_id);
CREATE INDEX IF NOT EXISTS poll_votes_user_id_idx ON public.poll_votes (user_id); 