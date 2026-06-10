-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "noSR" TEXT NOT NULL,
    "serviceRequests" TEXT NOT NULL,
    "seksi" TEXT NOT NULL,
    "noWO" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "keterangan" TEXT,
    "tanggalPengerjaan" TEXT,
    "d" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
