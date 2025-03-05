CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answer_text TEXT DEFAULT NULL,
    choice TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add RLS policies later
    CONSTRAINT answers_text_or_choice_check CHECK (
        (answer_text IS NOT NULL AND choice IS NULL) OR
        (answer_text IS NULL AND choice IS NOT NULL)
    )
);

-- Add comment to table
COMMENT ON TABLE public.answers IS 'Stores user answers to game questions';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS answers_question_id_idx ON public.answers (question_id);
CREATE INDEX IF NOT EXISTS answers_user_id_idx ON public.answers (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS answers_user_question_idx ON public.answers (user_id, question_id); 