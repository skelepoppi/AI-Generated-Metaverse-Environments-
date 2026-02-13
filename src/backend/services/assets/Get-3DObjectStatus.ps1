param (
    [string]$Id
)

if (-not $Id) {
    @{ error = "Request ID is required" } | ConvertTo-Json
    exit 1
}

# Mock polling behavior: in a real app, this would check an external API
# For this MVP, we simulate a successful generation
$response = @{
    id = $Id
    status = "complete"
    progress = 100
    file_url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb"
    thumbnail_url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/screenshot/screenshot.png"
    format = "glb"
}

$response | ConvertTo-Json
