
CREATE POLICY "user reads own source files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'sources' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "user uploads own source files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'sources' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "user deletes own source files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'sources' AND (storage.foldername(name))[1] = auth.uid()::text);
