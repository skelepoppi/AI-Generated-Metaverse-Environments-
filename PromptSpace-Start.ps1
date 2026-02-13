# PromptSpace MVP Starter Script

$RootPath = Get-Location
$BackendPath = Join-Path $RootPath "src\backend"
$FrontendPath = Join-Path $RootPath "src\frontend"
$ConfigFile = Join-Path $BackendPath "config.json"

# Check if config exists and has a key
if (Test-Path $ConfigFile) {
    $Config = Get-Content $ConfigFile | ConvertFrom-Json
    if ($Config.SkyboxApiKey -eq "YOUR_SKYBOX_API_KEY") {
        Write-Warning "Please update src\backend\config.json with your actual Blockade Labs API Key."
    }
}

Write-Host "Starting PromptSpace Backend Bridge..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File Bridge.ps1" -WorkingDirectory $BackendPath -WindowStyle Normal

Write-Host "Opening PromptSpace Frontend..." -ForegroundColor Cyan
$IndexFile = Join-Path $FrontendPath "index.html"
Start-Process $IndexFile

Write-Host "PromptSpace is now running!" -ForegroundColor Green
Write-Host "Keep the PowerShell bridge window open while using the app."
