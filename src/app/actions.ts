'use server';

import dbConnect from '../lib/db';
import Driver from '../models/Driver';
import Vehicle from '../models/Vehicle';
import User from '../models/User';
import { revalidatePath } from 'next/cache';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key-change-me');

export async function register(formData: FormData) {
    try {
        await dbConnect();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) return { success: false, message: 'Missing fields' };

        const existingUser = await User.findOne({ email });
        if (existingUser) return { success: false, message: 'User already exists' };

        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({ email, passwordHash });

        return { success: true, message: 'User created' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Registration failed' };
    }
}

export async function login(formData: FormData) {
    try {
        await dbConnect();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const user = await User.findOne({ email });
        if (!user) return { success: false, message: 'Invalid credentials' };

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return { success: false, message: 'Invalid credentials' };

        const token = await new SignJWT({ userId: user._id, email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1d')
            .sign(JWT_SECRET);

        (await cookies()).set('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return { success: true, message: 'Logged in' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Login failed' };
    }
}

export async function logout() {
    (await cookies()).delete('session');
    redirect('/login');
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function addDriver(formData: FormData) {
    try {
        const conn = await dbConnect();
        if (!conn) return { success: false, message: 'Database not configured' };

        const name = formData.get('name') as string;
        const type = formData.get('type') as string;
        const contact = formData.get('contact') as string;
        const location = formData.get('location') as string;

        if (!name || !type || !contact || !location) {
            return { success: false, message: 'Missing required fields' };
        }

        await Driver.create({
            name,
            type,
            contact,
            location,
            status: 'active'
        });

        revalidatePath('/ride');
        return { success: true, message: 'Driver added successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to add driver' };
    }
}

export async function addVehicle(formData: FormData) {
    try {
        const conn = await dbConnect();
        if (!conn) return { success: false, message: 'Database not configured' };

        const name = formData.get('name') as string;
        const type = formData.get('type') as string;
        const price = formData.get('price');
        const contact = formData.get('contact') as string;
        const description = formData.get('description') as string;

        if (!name || !type || !price || !contact) {
            return { success: false, message: 'Missing required fields' };
        }

        await Vehicle.create({
            name,
            type,
            price: Number(price),
            contact,
            description,
            isAvailable: true
        });

        revalidatePath('/rent');
        return { success: true, message: 'Vehicle added successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to add vehicle' };
    }
}

export async function deleteDriver(id: string) {
    try {
        await dbConnect();
        await Driver.findByIdAndDelete(id);
        revalidatePath('/ride');
        revalidatePath('/admin');
        return { success: true, message: 'Driver deleted' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete driver' };
    }
}

export async function deleteVehicle(id: string) {
    try {
        await dbConnect();
        await Vehicle.findByIdAndDelete(id);
        revalidatePath('/rent');
        revalidatePath('/admin');
        return { success: true, message: 'Vehicle deleted' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete vehicle' };
    }
}
