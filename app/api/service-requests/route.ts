import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { RequestStatus } from '@prisma/client';

const REQUEST_STATUSES = Object.values(RequestStatus);

function normalizeRequestStatus(status: unknown) {
  if (typeof status !== 'string') {
    return RequestStatus.PENDING;
  }

  const normalizedStatus = status.toUpperCase();

  if (REQUEST_STATUSES.includes(normalizedStatus as RequestStatus)) {
    return normalizedStatus as RequestStatus;
  }

  return RequestStatus.PENDING;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const divisi = searchParams.get('divisi');

    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (divisi) {
      where.user = { divisi };
    }

    const serviceRequests = await prisma.serviceRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(serviceRequests);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.unit || !body.serviceRequests) {
      return NextResponse.json(
        { error: 'Unit and Service Requests are required' },
        { status: 400 }
      );
    }

    const userId = Number(body.userId);

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      );
    }

    // Create new service request
    const newRequest = await prisma.serviceRequest.create({
      data: {
        date: body.date || new Date().toISOString().split('T')[0],
        unit: body.unit,
        noSR: body.noSR || '',
        serviceRequests: body.serviceRequests,
        seksi: body.seksi || '',
        noWO: body.noWO,
        status: normalizeRequestStatus(body.status),
        keterangan: body.keterangan,
        tanggalPengerjaan: body.tanggalPengerjaan,
        d: body.d,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating service request:', error);
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
