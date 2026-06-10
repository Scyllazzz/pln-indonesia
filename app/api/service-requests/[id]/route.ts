import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { RequestStatus } from '@prisma/client';

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
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

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(serviceRequest);
  } catch (error) {
    console.error('Error fetching service request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service request' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    const body = await request.json();

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id },
      data: {
        date: body.date,
        unit: body.unit,
        noSR: body.noSR,
        serviceRequests: body.serviceRequests,
        seksi: body.seksi,
        noWO: body.noWO,
        status: normalizeRequestStatus(body.status),
        keterangan: body.keterangan,
        tanggalPengerjaan: body.tanggalPengerjaan,
        d: body.d,
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

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating service request:', error);
    return NextResponse.json(
      { error: 'Failed to update service request' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    await prisma.serviceRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service request:', error);
    return NextResponse.json(
      { error: 'Failed to delete service request' },
      { status: 500 }
    );
  }
}
