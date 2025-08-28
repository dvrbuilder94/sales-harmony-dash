-- Create channels table
CREATE TABLE IF NOT EXISTS public.channels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar NOT NULL UNIQUE,
  realtime boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Create policies for channels
CREATE POLICY "Allow all operations on channels" 
ON public.channels 
FOR ALL 
USING (true);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  action varchar NOT NULL,
  details text,
  user_id uuid,
  channel_id uuid REFERENCES public.channels(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for audit_logs
CREATE POLICY "Allow all operations on audit_logs" 
ON public.audit_logs 
FOR ALL 
USING (true);

-- Add channel_id to ventas table
ALTER TABLE public.ventas 
ADD COLUMN IF NOT EXISTS channel_id uuid REFERENCES public.channels(id);

-- Insert some default channels
INSERT INTO public.channels (name, realtime) VALUES 
('Amazon', true),
('eBay', false),
('Shopify', true),
('WooCommerce', false)
ON CONFLICT (name) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for channels
DROP TRIGGER IF EXISTS update_channels_updated_at ON public.channels;
CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON public.channels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for new tables
ALTER publication supabase_realtime ADD TABLE public.channels;
ALTER publication supabase_realtime ADD TABLE public.audit_logs;

-- Set replica identity for realtime updates
ALTER TABLE public.channels REPLICA IDENTITY FULL;
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;