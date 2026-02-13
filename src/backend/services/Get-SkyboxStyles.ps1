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

$url = "https://backend.blockadelabs.com/api/v1/skybox/styles?api_key=$ApiKey"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    $response | ConvertTo-Json
} catch {
    $errorObj = @{ 
        error = "Failed to retrieve Skybox styles"
        details = $_.Exception.Message
    }
    $errorObj | ConvertTo-Json
    exit 1
}
