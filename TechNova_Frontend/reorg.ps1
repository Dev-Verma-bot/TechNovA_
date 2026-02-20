$ErrorActionPreference = "Continue"

# Create directories
$dirs = @(
  "src\assets\images", "src\assets\icons", "src\assets\logos", "src\assets\illustrations",
  "src\components\common", "src\components\user", "src\components\admin", "src\components\charts",
  "src\pages", "src\layouts", "src\routes", "src\services", "src\redux\slices", "src\redux\reducers",
  "src\hooks", "src\utils", "src\config", "src\styles"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

# Move / Rename Redux
Move-Item -Path "src\app\store.js" -Destination "src\redux\store.js" -Force
Move-Item -Path "src\features\auth\authSlice.js" -Destination "src\redux\slices\authSlice.js" -Force
Move-Item -Path "src\features\application\applicationSlice.js" -Destination "src\redux\slices\loanSlice.js" -Force
Move-Item -Path "src\features\decision\decisionSlice.js" -Destination "src\redux\slices\riskSlice.js" -Force
Move-Item -Path "src\features\fairness\fairnessSlice.js" -Destination "src\redux\slices\fairnessSlice.js" -Force

# We need userSlice, adminSlice
New-Item -ItemType File -Force -Path "src\redux\slices\userSlice.js" | Out-Null
New-Item -ItemType File -Force -Path "src\redux\slices\adminSlice.js" | Out-Null
New-Item -ItemType File -Force -Path "src\redux\reducers\rootReducer.js" | Out-Null

# Move hooks
Move-Item -Path "src\app\hooks.js" -Destination "src\hooks\useAppDispatch.js" -Force
New-Item -ItemType File -Force -Path "src\hooks\useAuth.js" | Out-Null
New-Item -ItemType File -Force -Path "src\hooks\useLoan.js" | Out-Null

# Clean up old dirs
Remove-Item -Path "src\app" -Recurse -Force
Remove-Item -Path "src\features" -Recurse -Force

# Styles
Move-Item -Path "src\index.css" -Destination "src\styles\index.css" -Force
New-Item -ItemType File -Force -Path "src\styles\tailwind.css" | Out-Null
New-Item -ItemType File -Force -Path "src\styles\dashboard.css" | Out-Null

# Components and Pages
If (Test-Path "src\pages\Landing.jsx") { Move-Item -Path "src\pages\Landing.jsx" -Destination "src\pages\Home.jsx" -Force }
If (Test-Path "src\pages\ApplicationForm.jsx") { Move-Item -Path "src\pages\ApplicationForm.jsx" -Destination "src\components\user\LoanApplicationForm.jsx" -Force }
If (Test-Path "src\pages\DecisionResult.jsx") { Move-Item -Path "src\pages\DecisionResult.jsx" -Destination "src\components\user\RiskResultCard.jsx" -Force }
If (Test-Path "src\pages\WhatIfSimulator.jsx") { Move-Item -Path "src\pages\WhatIfSimulator.jsx" -Destination "src\components\user\WhatIfSimulator.jsx" -Force }
If (Test-Path "src\pages\AdminDashboard.jsx") { Move-Item -Path "src\pages\AdminDashboard.jsx" -Destination "src\components\admin\AdminDashboard.jsx" -Force }
If (Test-Path "src\pages\FairnessDashboard.jsx") { Move-Item -Path "src\pages\FairnessDashboard.jsx" -Destination "src\components\admin\FairnessReport.jsx" -Force }
If (Test-Path "src\pages\AIReport.jsx") { Remove-Item -Path "src\pages\AIReport.jsx" -Force }

# Extra Pages Requested
$pages = @(
  "Login.jsx", "Register.jsx", "UserPanel.jsx", "AdminPanel.jsx", 
  "UserDashboardPage.jsx", "AdminDashboardPage.jsx", "LoanApplyPage.jsx", 
  "LoanResultPage.jsx", "NotFound.jsx"
)
foreach ($f in $pages) { New-Item -ItemType File -Force -Path "src\pages\$f" | Out-Null }

# Extra components common
$common = @("Button.jsx", "InputField.jsx", "Modal.jsx", "Loader.jsx", ".jsx", "Sidebar.jsx", "ProtectedRoute.jsx")
foreach ($f in $common) { New-Item -ItemType File -Force -Path "src\components\common\$f" | Out-Null }

# Extra components user
$user = @("UserDashboard.jsx", "LoanStatusCard.jsx", "ImprovementSuggestions.jsx")
foreach ($f in $user) { New-Item -ItemType File -Force -Path "src\components\user\$f" | Out-Null }

# Extra components admin
$admin = @("LoanRequestsTable.jsx", "ApplicantDetails.jsx", "RiskAnalysisPanel.jsx", "SHAPVisualization.jsx", "ApprovalActions.jsx")
foreach ($f in $admin) { New-Item -ItemType File -Force -Path "src\components\admin\$f" | Out-Null }

# Extra components charts
$charts = @("RiskPieChart.jsx", "ApprovalRateChart.jsx", "FeatureImportanceChart.jsx", "BiasHeatmap.jsx")
foreach ($f in $charts) { New-Item -ItemType File -Force -Path "src\components\charts\$f" | Out-Null }

# Routes
New-Item -ItemType File -Force -Path "src\routes\AppRoutes.jsx" | Out-Null
New-Item -ItemType File -Force -Path "src\routes\RoleBasedRoutes.jsx" | Out-Null

# Services
$services = @("api.js", "authService.js", "loanService.js", "adminService.js")
foreach ($f in $services) { New-Item -ItemType File -Force -Path "src\services\$f" | Out-Null }

# Utils
$utils = @("validators.js", "riskCalculatorHelper.js", "formatCurrency.js", "constants.js")
foreach ($f in $utils) { New-Item -ItemType File -Force -Path "src\utils\$f" | Out-Null }

# Config
New-Item -ItemType File -Force -Path "src\config\axiosConfig.js" | Out-Null

# Layouts (rename current ones to match if needed)
If (Test-Path "src\layouts\MainLayout.jsx") { Move-Item -Path "src\layouts\MainLayout.jsx" -Destination "src\layouts\UserLayout.jsx" -Force }

# Other root
New-Item -ItemType File -Force -Path "src\index.js" | Out-Null

Write-Host "Reorg completed"
