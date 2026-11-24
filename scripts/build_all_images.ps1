# build_all_images.ps1
# Genera las 104 imagenes de producto en alta definicion
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$csFile = Join-Path $scriptDir "CatalogBatchCompositor.cs"

Write-Host "Compilando CatalogBatchCompositor.cs..." -ForegroundColor Cyan
Add-Type -Path $csFile -ReferencedAssemblies System.Drawing

$logoPath = Join-Path $scriptDir "..\public\logo-etiqueta.png"
[CatalogBatchCompositor]::Initialize($logoPath)

$jsonPath = Join-Path $scriptDir "products_to_generate.json"
$products = Get-Content $jsonPath -Raw | ConvertFrom-Json

$publicDir = Join-Path $scriptDir "..\public\productos"

Write-Host "Iniciando generacion masiva de $($products.Count) productos..." -ForegroundColor Yellow
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$count = 0

foreach ($p in $products) {
    $count++
    $tplPath = Join-Path $publicDir $p.template
    $outPath = Join-Path $publicDir "$($p.slug).jpg"

    [CatalogBatchCompositor]::GenerateProductImage(
        $tplPath,
        $outPath,
        $p.category,
        $p.name,
        $p.subtitle
    )

    if ($count % 20 -eq 0 -or $count -eq $products.Count) {
        Write-Host "[$count/$($products.Count)] Procesados... ($($sw.ElapsedMilliseconds) ms)" -ForegroundColor Gray
    }
}

$sw.Stop()
Write-Host "¡Generacion completa! $($products.Count) productos creados en $($sw.ElapsedMilliseconds) ms (~$([math]::Round($sw.ElapsedMilliseconds / 1000, 2)) segundos)" -ForegroundColor Green
