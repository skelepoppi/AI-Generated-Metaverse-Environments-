param (
    [string]$Prompt = "A futuristic chair",
    [string]$Model = "shap-e"
)

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ConfigFile = Join-Path $PSScriptRoot "..\..\config.json"

if (Test-Path $ConfigFile) {
    $Config = Get-Content $ConfigFile | ConvertFrom-Json
    $ApiKey = $Config.SkyboxApiKey # Reusing same config structure
}

# In a real integration, this would call a service like Hugging Face or Blockade Labs
# For this MVP, we return a mock request ID that will be polled
$requestId = "3D_" + [guid]::NewGuid().ToString().Substring(0,8)

$response = @{
    id = $requestId
    status = "pending"
    prompt = $Prompt
    model = $Model
    estimated_time = "30-60 seconds"
}

$response | ConvertTo-Json
