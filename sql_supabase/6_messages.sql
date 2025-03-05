CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    photo_url TEXT DEFAULT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add RLS policies later
    CONSTRAINT messages_content_not_empty CHECK (length(content) > 0)
);

-- Add comment to table
COMMENT ON TABLE public.messages IS 'Stores chat messages';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS messages_room_id_idx ON public.messages (room_id);
CREATE INDEX IF NOT EXISTS messages_user_id_idx ON public.messages (user_id);
CREATE INDEX IF NOT EXISTS messages_timestamp_idx ON public.messages (timestamp); 