param([Parameter(Mandatory=$true)][string]$PathFile)
$ErrorActionPreference = 'Stop'
try {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if ($node) {
    $version = & $node.Source -p "process.versions.node.split('.')[0]"
    if ($LASTEXITCODE -eq 0 -and [int]$version -ge 20) {
      [IO.File]::WriteAllText($PathFile, (Split-Path $node.Source), [Text.Encoding]::Default)
      exit 0
    }
  }
  $version = '24.21.0'
  $arch = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64' -or $env:PROCESSOR_ARCHITEW6432 -eq 'ARM64') { 'arm64' } else { 'x64' }
  $root = Join-Path $env:LOCALAPPDATA '3B\runtime'
  $name = "node-v$version-win-$arch"
  $target = Join-Path $root $name
  $executable = Join-Path $target 'node.exe'
  if (!(Test-Path $executable)) {
    Write-Host "Node.js ontbreekt of is te oud. 3B zet Node.js $version klaar voor deze batch."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    New-Item -ItemType Directory -Force -Path $root | Out-Null
    $stage = Join-Path $root ([Guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $stage | Out-Null
    try {
      $archive = "$name.zip"
      $url = "https://nodejs.org/download/release/v$version/"
      Invoke-WebRequest -UseBasicParsing -Uri ($url + 'SHASUMS256.txt') -OutFile (Join-Path $stage 'SHASUMS256.txt')
      Invoke-WebRequest -UseBasicParsing -Uri ($url + $archive) -OutFile (Join-Path $stage $archive)
      $line = Get-Content (Join-Path $stage 'SHASUMS256.txt') | Where-Object { $_ -match ('^[a-f0-9]{64}\s+' + [regex]::Escape($archive) + '$') }
      if (@($line).Count -ne 1) { throw 'Node-download ontbreekt in de officiele SHA256-lijst.' }
      $expected = ($line -split '\s+')[0]
      $actual = (Get-FileHash (Join-Path $stage $archive) -Algorithm SHA256).Hash.ToLowerInvariant()
      if ($actual -ne $expected) { throw 'Node-download is onvolledig: SHA256 klopt niet.' }
      Expand-Archive -Path (Join-Path $stage $archive) -DestinationPath $stage
      Move-Item -Path (Join-Path $stage $name) -Destination $target
    } finally { Remove-Item -Recurse -Force $stage -ErrorAction SilentlyContinue }
  }
  $check = & $executable -p "process.versions.node"
  if ($LASTEXITCODE -ne 0 -or $check -ne $version) { throw 'De eigen Node-installatie van 3B start niet.' }
  [IO.File]::WriteAllText($PathFile, $target, [Text.Encoding]::Default)
  Write-Host "3B gebruikt Node.js $check."
  exit 0
} catch {
  Write-Host ("FOUT: " + $_.Exception.Message)
  exit 1
}
