# Run Prisma migrations using an explicit DATABASE_URL
# Usage: Open PowerShell in repo root and run this script.

param(
    [string]$DatabaseUrl
)

if (-not $DatabaseUrl) {
    if ($env:DATABASE_URL) {
        $DatabaseUrl = $env:DATABASE_URL
    } else {
        Write-Host "Enter DATABASE_URL (postgresql://...):"
        $DatabaseUrl = Read-Host
    }
}

if (-not $DatabaseUrl) {
    Write-Error "No DATABASE_URL provided. Aborting."
    exit 1
}

# Export to environment for prisma commands
$env:DATABASE_URL = $DatabaseUrl

Write-Host "Running: npx prisma generate"
$n = Start-Process -FilePath npx -ArgumentList "prisma generate" -NoNewWindow -Wait -PassThru
if ($n.ExitCode -ne 0) { Write-Error "prisma generate failed (exit $($n.ExitCode))."; exit $n.ExitCode }

Write-Host "Checking prisma/migrations folder..."
if (Test-Path prisma\migrations -PathType Container -ErrorAction SilentlyContinue) {
    $entries = Get-ChildItem prisma\migrations -Directory | Measure-Object | Select-Object -ExpandProperty Count
} else {
    $entries = 0
}

if ($entries -gt 0) {
    Write-Host "Migrations found ($entries). Running prisma migrate deploy"
    $p = Start-Process -FilePath npx -ArgumentList "prisma migrate deploy" -NoNewWindow -Wait -PassThru
    exit $p.ExitCode
} else {
    Write-Host "No migrations found — running prisma db push --accept-data-loss"
    $p = Start-Process -FilePath npx -ArgumentList "prisma db push --accept-data-loss" -NoNewWindow -Wait -PassThru
    exit $p.ExitCode
}
