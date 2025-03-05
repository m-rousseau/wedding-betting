-- Create storage buckets for the app
INSERT INTO storage.buckets (id, name, public)
VALUES ('selfies', 'selfies', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('chat_photos', 'chat_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for selfies
CREATE POLICY "Anyone can view selfies"
ON storage.objects FOR SELECT
USING (bucket_id = 'selfies');

CREATE POLICY "Users can upload their own selfies"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'selfies' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for chat photos
CREATE POLICY "Anyone can view chat photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat_photos');

CREATE POLICY "Users can upload chat photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat_photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
); 