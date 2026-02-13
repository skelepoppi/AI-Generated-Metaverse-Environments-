param (
    [string]$ApiKey = "YOUR_SKYBOX_API_KEY",
    [string]$Prompt = "A beautiful sunset over a cyberpunk city",
    [int]$StyleId = 20
)

$url = "https://backend.blockadelabs.com/api/v1/skybox?api_key=$ApiKey"
$body = @{
    prompt = $Prompt
    skybox_style_id = $StyleId
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json
} catch {
    Write-Error "Failed to initiate Skybox generation: $_"
}
