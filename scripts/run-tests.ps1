# Comprehensive Test Runner Script for E-commerce Project
# This script runs tests for both backend and frontend

param(
    [string]$Environment = "all",
    [switch]$Watch,
    [switch]$Coverage,
    [switch]$Verbose,
    [switch]$Help
)

function Show-Help {
    Write-Host @"
E-commerce Project Test Runner

Usage: .\run-tests.ps1 [options]

Options:
    -Environment <string>    Test environment: 'backend', 'frontend', or 'all' (default)
    -Watch                   Run tests in watch mode (frontend only)
    -Coverage               Generate coverage reports
    -Verbose                Show detailed output
    -Help                   Show this help message

Examples:
    .\run-tests.ps1                          # Run all tests
    .\run-tests.ps1 -Environment backend     # Run only backend tests
    .\run-tests.ps1 -Environment frontend    # Run only frontend tests
    .\run-tests.ps1 -Coverage                # Run tests with coverage
    .\run-tests.ps1 -Watch                   # Run frontend tests in watch mode
"@
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-Backend {
    Write-ColorOutput "`n🚀 Running Backend Tests..." "Cyan"
    
    if (-not (Test-Path "backend")) {
        Write-ColorOutput "❌ Backend directory not found!" "Red"
        return $false
    }
    
    Set-Location "backend"
    
    try {
        # Check if dependencies are installed
        if (-not (Test-Path "node_modules")) {
            Write-ColorOutput "📦 Installing backend dependencies..." "Yellow"
            npm install
        }
        
        # Run tests
        if ($Coverage) {
            Write-ColorOutput "📊 Running backend tests with coverage..." "Green"
            npm run test:coverage
        } else {
            Write-ColorOutput "🧪 Running backend tests..." "Green"
            npm test
        }
        
        $backendSuccess = $LASTEXITCODE -eq 0
        if ($backendSuccess) {
            Write-ColorOutput "✅ Backend tests completed successfully!" "Green"
        } else {
            Write-ColorOutput "❌ Backend tests failed!" "Red"
        }
        
        return $backendSuccess
    }
    catch {
        Write-ColorOutput "❌ Error running backend tests: $($_.Exception.Message)" "Red"
        return $false
    }
    finally {
        Set-Location ".."
    }
}

function Test-Frontend {
    Write-ColorOutput "`n🚀 Running Frontend Tests..." "Cyan"
    
    if (-not (Test-Path "frontend")) {
        Write-ColorOutput "❌ Frontend directory not found!" "Red"
        return $false
    }
    
    Set-Location "frontend"
    
    try {
        # Check if dependencies are installed
        if (-not (Test-Path "node_modules")) {
            Write-ColorOutput "📦 Installing frontend dependencies..." "Yellow"
            npm install
        }
        
        # Run tests
        if ($Watch) {
            Write-ColorOutput "👀 Running frontend tests in watch mode..." "Green"
            npm run test:watch
        } elseif ($Coverage) {
            Write-ColorOutput "📊 Running frontend tests with coverage..." "Green"
            npm run test:coverage
        } else {
            Write-ColorOutput "🧪 Running frontend tests..." "Green"
            npm test -- --watchAll=false
        }
        
        $frontendSuccess = $LASTEXITCODE -eq 0
        if ($frontendSuccess) {
            Write-ColorOutput "✅ Frontend tests completed successfully!" "Green"
        } else {
            Write-ColorOutput "❌ Frontend tests failed!" "Red"
        }
        
        return $frontendSuccess
    }
    catch {
        Write-ColorOutput "❌ Error running frontend tests: $($_.Exception.Message)" "Red"
        return $false
    }
    finally {
        Set-Location ".."
    }
}

function Show-TestSummary {
    param(
        [bool]$BackendSuccess,
        [bool]$FrontendSuccess
    )
    
    Write-ColorOutput "`n📋 Test Summary" "Magenta"
    Write-ColorOutput "================" "Magenta"
    
    if ($BackendSuccess -and $FrontendSuccess) {
        Write-ColorOutput "🎉 All tests passed successfully!" "Green"
    } elseif ($BackendSuccess) {
        Write-ColorOutput "✅ Backend tests passed, ❌ Frontend tests failed" "Yellow"
    } elseif ($FrontendSuccess) {
        Write-ColorOutput "❌ Backend tests failed, ✅ Frontend tests passed" "Yellow"
    } else {
        Write-ColorOutput "❌ All tests failed!" "Red"
    }
    
    if ($BackendSuccess) {
        Write-ColorOutput "`nBackend: ✅ PASSED" "Green"
    } else {
        Write-ColorOutput "`nBackend: ❌ FAILED" "Red"
    }
    
    if ($FrontendSuccess) {
        Write-ColorOutput "Frontend: ✅ PASSED" "Green"
    } else {
        Write-ColorOutput "Frontend: ❌ FAILED" "Red"
    }
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

Write-ColorOutput "🧪 E-commerce Project Test Runner" "Magenta"
Write-ColorOutput "=================================" "Magenta"

$backendSuccess = $false
$frontendSuccess = $false

try {
    switch ($Environment.ToLower()) {
        "backend" {
            $backendSuccess = Test-Backend
        }
        "frontend" {
            $frontendSuccess = Test-Frontend
        }
        "all" {
            $backendSuccess = Test-Backend
            $frontendSuccess = Test-Frontend
        }
        default {
            Write-ColorOutput "❌ Invalid environment specified. Use 'backend', 'frontend', or 'all'" "Red"
            exit 1
        }
    }
    
    Show-TestSummary -BackendSuccess $backendSuccess -FrontendSuccess $frontendSuccess
    
    # Exit with appropriate code
    if ($backendSuccess -and $frontendSuccess) {
        exit 0
    } else {
        exit 1
    }
}
catch {
    Write-ColorOutput "❌ Unexpected error: $($_.Exception.Message)" "Red"
    exit 1
}
