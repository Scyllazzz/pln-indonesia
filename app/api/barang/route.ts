import { NextRequest, NextResponse } from 'next/server';

// Dummy data untuk barang
let dummyBarang = [
  { id: 1, nama: 'Relay', kategori: 'Elektronik', stok: 50, satuan: 'Piece' },
  { id: 2, nama: 'Kapasitor', kategori: 'Elektronik', stok: 100, satuan: 'Piece' },
  { id: 3, nama: 'Resistor', kategori: 'Elektronik', stok: 200, satuan: 'Piece' },
  { id: 4, nama: 'Transformator', kategori: 'Elektro Mekanik', stok: 15, satuan: 'Unit' },
  { id: 5, nama: 'Motor', kategori: 'Elektro Mekanik', stok: 8, satuan: 'Unit' },
  { id: 6, nama: 'Kabel NYM', kategori: 'Kabel', stok: 500, satuan: 'Meter' },
  { id: 7, nama: 'Sekering', kategori: 'Proteksi', stok: 80, satuan: 'Piece' },
  { id: 8, nama: 'MCB', kategori: 'Proteksi', stok: 60, satuan: 'Piece' },
];

let nextId = 9;

export async function GET(request: NextRequest) {
  try {
    // Return all barang
    return NextResponse.json(dummyBarang);
  } catch (error) {
    console.error('Error fetching barang:', error);
    return NextResponse.json(
      { error: 'Failed to fetch barang' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.nama || !body.kategori) {
      return NextResponse.json(
        { error: 'Nama and Kategori are required' },
        { status: 400 }
      );
    }

    // Create new barang
    const newBarang = {
      id: nextId++,
      nama: body.nama,
      kategori: body.kategori,
      stok: body.stok || 0,
      satuan: body.satuan || '',
    };

    dummyBarang.push(newBarang);

    return NextResponse.json(newBarang, { status: 201 });
  } catch (error) {
    console.error('Error creating barang:', error);
    return NextResponse.json(
      { error: 'Failed to create barang' },
      { status: 500 }
    );
  }
}
