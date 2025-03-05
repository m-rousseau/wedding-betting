CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT false,
    participants JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    
    -- Add RLS policies later
);

-- Add comment to table
COMMENT ON TABLE public.chat_rooms IS 'Stores chat rooms for wedding guests';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS chat_rooms_is_private_idx ON public.chat_rooms (is_private);
CREATE INDEX IF NOT EXISTS chat_rooms_participants_idx ON public.chat_rooms USING GIN (participants); 