-- Fix sales data security vulnerability
-- Remove the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Allow all operations on ventas" ON public.ventas;

-- Create secure policies that restrict access to admins only
CREATE POLICY "Only admins can view sales records" 
ON public.ventas 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert sales records" 
ON public.ventas 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update sales records" 
ON public.ventas 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete sales records" 
ON public.ventas 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));