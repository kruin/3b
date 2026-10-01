$ErrorActionPreference = "Stop"
$configPath = Join-Path $PSScriptRoot "config-v173.js"
if (-not (Test-Path -LiteralPath $configPath)) { throw "config-v173.js ontbreekt." }

$url = (Read-Host "Supabase Project URL, bijvoorbeeld https://abc.supabase.co").Trim()
$anonKey = (Read-Host "Supabase public anon key").Trim()
if ($url -notmatch '^https://[a-z0-9-]+\.supabase\.co/?$') { throw "Ongeldige Supabase Project URL." }
if ($anonKey.Length -lt 40) { throw "De public anon key lijkt onvolledig." }

$text = Get-Content -LiteralPath $configPath -Raw
$text = $text -replace 'paymentEnabled:\s*(true|false)', 'paymentEnabled: true'
$text = $text -replace 'paymentUrl:\s*"[^"]*"', ('paymentUrl: "' + $url.TrimEnd('/') + '"')
$text = $text -replace 'paymentAnonKey:\s*"[^"]*"', ('paymentAnonKey: "' + $anonKey.Replace('"','') + '"')
Set-Content -LiteralPath $configPath -Value $text -Encoding UTF8
