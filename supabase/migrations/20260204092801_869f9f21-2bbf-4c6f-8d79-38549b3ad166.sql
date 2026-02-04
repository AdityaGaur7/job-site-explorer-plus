-- Add user_id column to job_sites for user isolation
ALTER TABLE public.job_sites 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON public.job_sites;
DROP POLICY IF EXISTS "Allow public insert" ON public.job_sites;
DROP POLICY IF EXISTS "Allow public update" ON public.job_sites;
DROP POLICY IF EXISTS "Allow public delete" ON public.job_sites;

-- Create secure RLS policies for authenticated users only
CREATE POLICY "Users can view their own job sites"
  ON public.job_sites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job sites"
  ON public.job_sites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job sites"
  ON public.job_sites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job sites"
  ON public.job_sites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);