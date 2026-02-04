-- Create job_sites table
CREATE TABLE public.job_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_sites ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is a collection app without auth for now)
CREATE POLICY "Allow public read access"
  ON public.job_sites
  FOR SELECT
  USING (true);

-- Create policy for public insert
CREATE POLICY "Allow public insert"
  ON public.job_sites
  FOR INSERT
  WITH CHECK (true);

-- Create policy for public update
CREATE POLICY "Allow public update"
  ON public.job_sites
  FOR UPDATE
  USING (true);

-- Create policy for public delete
CREATE POLICY "Allow public delete"
  ON public.job_sites
  FOR DELETE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_sites_updated_at
  BEFORE UPDATE ON public.job_sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();