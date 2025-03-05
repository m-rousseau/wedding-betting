CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    timer_end TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'ended')),
    confirmed_winners JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add RLS policies later
    CONSTRAINT games_status_check CHECK (status IN ('active', 'ended'))
);

-- Add comment to table
COMMENT ON TABLE public.games IS 'Stores wedding betting games';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS games_status_idx ON public.games (status);
CREATE INDEX IF NOT EXISTS games_timer_end_idx ON public.games (timer_end); 