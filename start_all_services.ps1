# Start Backend
Write-Host "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\Aveo\aveoearthdevs\backend; `$env:DEBUG='True'; python main.py" -WindowStyle Minimized

Start-Sleep -Seconds 3

# Start AI Service (if exists)
if (Test-Path "E:\Aveo\aveoearthdevs\ai\main.py") {
    Write-Host "Starting AI Service..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\Aveo\aveoearthdevs\ai; python main.py" -WindowStyle Minimized
}

Write-Host "Services starting... Waiting 20 seconds for startup..."
Start-Sleep -Seconds 20

Write-Host "Checking services..."
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is running"
} catch {
    Write-Host "⚠️ Backend not responding yet"
}

try {
    $ai = Invoke-WebRequest -Uri "http://localhost:8002/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ AI Service is running"
} catch {
    Write-Host "⚠️ AI Service not responding yet"
}

