import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        divisi: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    );
  }
}

// POST create new user (optional)
export async function POST(request: NextRequest) {
  try {
    const { name, username, password, divisi, role } = await request.json();

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password,
        divisi,
        role: role || 'USER',
      },
    });

    return NextResponse.json(
      { message: 'User created', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}
