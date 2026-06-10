import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

// Simple JWT-like token generator (in production, use a proper JWT library)
function generateToken(userId: number, username: string, name: string, role: string): string {
  const payload = {
    userId,
    username,
    name,
    role,
    iat: Math.floor(Date.now() / 1000),
  };
  // Simple base64 encoding (NOT secure for production)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id, user.username, user.name, user.role);

    return NextResponse.json(
      {
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          divisi: user.divisi,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
