import { z } from 'zod';

export const AdminLoginSchema = z.object(
    {
        email: z.string().email('Email invalido'),
        password: z.string().min(6, 'Password debe tener al menos 6 caracteres')
    }
);

export type AdminLoginData = z.infer<typeof AdminLoginSchema>;
