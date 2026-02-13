param (
    [string]$ApiKey = "YOUR_SKYBOX_API_KEY",
    [string]$Id
)

if (-not $Id) {
    Write-Error "Generation ID is required."
    exit 1
}

$url = "https://backend.blockadelabs.com/api/v1/skybox/requests/$Id?api_key=$ApiKey"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Error "Failed to check Skybox status: $_"
}
