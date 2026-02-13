param (
    [string]$Prompt = "A beautiful sunset over a cyberpunk city",
    [int]$StyleId = 20
)

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ConfigFile = Join-Path $PSScriptRoot "..\config.json"

if (Test-Path $ConfigFile) {
    $Config = Get-Content $ConfigFile | ConvertFrom-Json
    $ApiKey = $Config.SkyboxApiKey
} else {
    $ApiKey = "YOUR_SKYBOX_API_KEY"
}

if ([string]::IsNullOrWhiteSpace($ApiKey) -or $ApiKey -eq "YOUR_SKYBOX_API_KEY") {
    $errorObj = @{ error = "Invalid or missing API Key in config.json" }
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
