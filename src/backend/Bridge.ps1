$RequestFile = "request.json"
$ResponseFile = "response.json"
$ServicePath = "services"

Write-Host "Bridge started. Watching for requests..."

while ($true) {
    if (Test-Path $RequestFile) {
        try {
            $Request = Get-Content $RequestFile | ConvertFrom-Json
            $Command = $Request.command
            $Params = $Request.params

            Write-Host "Executing: $Command"
            
            $ScriptPath = Join-Path $ServicePath $Command
            if (Test-Path $ScriptPath) {
                # Build param string
                $ParamString = ""
                if ($Params) {
                    foreach ($key in $Params.psobject.properties.name) {
                        $val = $Params.$key
                        $ParamString += " -$key '$val'"
                    }
                }

                $Output = powershell -ExecutionPolicy Bypass -Command "& '$ScriptPath' $ParamString"
                $Output | Out-File $ResponseFile
            } else {
                @{ error = "Script not found: $Command" } | ConvertTo-Json | Out-File $ResponseFile
            }
        } catch {
            @{ error = "Bridge error: $_" } | ConvertTo-Json | Out-File $ResponseFile
        } finally {
            Remove-Item $RequestFile
        }
    }
    Start-Sleep -Milliseconds 500
}
