-- Create admin role for user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('7e1ff189-727e-405b-9930-9eda6113a714', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;