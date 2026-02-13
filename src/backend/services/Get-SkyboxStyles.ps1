param (
    [string]$ApiKey = "YOUR_SKYBOX_API_KEY"
)

$url = "https://backend.blockadelabs.com/api/v1/skybox/styles?api_key=$ApiKey"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    $response | ConvertTo-Json
} catch {
    Write-Error "Failed to retrieve Skybox styles: $_"
}
