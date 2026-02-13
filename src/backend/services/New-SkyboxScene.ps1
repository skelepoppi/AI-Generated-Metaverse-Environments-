param (
    [string]$ApiKey = "YOUR_SKYBOX_API_KEY",
    [string]$Prompt = "A beautiful sunset over a cyberpunk city",
    [int]$StyleId = 20
)

if ([string]::IsNullOrWhiteSpace($ApiKey) -or $ApiKey -eq "YOUR_SKYBOX_API_KEY") {
    $errorObj = @{ error = "Invalid or missing API Key" }
    $errorObj | ConvertTo-Json
    exit 1
}

$url = "https://backend.blockadelabs.com/api/v1/skybox?api_key=$ApiKey"
$body = @{
    prompt = $Prompt
    skybox_style_id = $StyleId
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $details = $_.ErrorDetails.Message
    if (-not $details) { $details = $_.Exception.Message }
    
    $errorObj = @{ 
        error = "Failed to initiate Skybox generation"
        status = $status
        details = $details
    }
    $errorObj | ConvertTo-Json
    exit 1
}
