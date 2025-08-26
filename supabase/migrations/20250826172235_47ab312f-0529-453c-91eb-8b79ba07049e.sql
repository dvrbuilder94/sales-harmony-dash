-- Enable Row Level Security on ventas table
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

-- Create policies for ventas table (allow all operations for now)
CREATE POLICY "Allow all operations on ventas" 
ON public.ventas 
FOR ALL 
USING (true);

-- Enable Row Level Security on pagos table
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Create policies for pagos table (allow all operations for now)
CREATE POLICY "Allow all operations on pagos" 
ON public.pagos 
FOR ALL 
USING (true);