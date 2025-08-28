-- Fix payment records security vulnerability
-- Remove the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Allow all operations on pagos" ON public.pagos;

-- Create secure policies that restrict access to admins only
CREATE POLICY "Only admins can view payment records" 
ON public.pagos 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert payment records" 
ON public.pagos 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update payment records" 
ON public.pagos 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete payment records" 
ON public.pagos 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));