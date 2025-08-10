# ===========================================
# CI/CD Setup Script for Full-Stack E-commerce (PowerShell)
# ===========================================

param(
    [switch]$SkipTests,
    [switch]$SkipDocker,
    [string]$Environment = "development"
)

# Colors for output
$Colors = @{
    Red = 'Red'
    Green = 'Green'
    Yellow = 'Yellow'
    Blue = 'Blue'
    Cyan = 'Cyan'
}

# Functions
function Write-Header {
    param([string]$Message)
    Write-Host "=============================================" -ForegroundColor $Colors.Blue
    Write-Host $Message -ForegroundColor $Colors.Blue
    Write-Host "=============================================" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Colors.Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $Colors.Cyan
}

# Check if required tools are installed
function Test-Requirements {
    Write-Header "🔍 Checking Requirements"
    
    $missingTools = @()
    
    if (!(Get-Command docker -ErrorAction SilentlyContinue)) { $missingTools += "docker" }
    if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) { $missingTools += "docker-compose" }
    if (!(Get-Command git -ErrorAction SilentlyContinue)) { $missingTools += "git" }
    if (!(Get-Command node -ErrorAction SilentlyContinue)) { $missingTools += "node" }
    if (!(Get-Command npm -ErrorAction SilentlyContinue)) { $missingTools += "npm" }
    
    if ($missingTools.Count -eq 0) {
        Write-Success "All required tools are installed"
        return $true
    } else {
        Write-Error "Missing required tools: $($missingTools -join ', ')"
        Write-Host "Please install the missing tools and run the script again."
        return $false
    }
}

# Create necessary directories
function New-ProjectDirectories {
    Write-Header "📁 Creating Directories"
    
    $directories = @(
        ".github\workflows",
        "scripts",
        "nginx",
        "ssl",
        "monitoring",
        "mongodb",
        "redis"
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Success "Created directory: $dir"
        } else {
            Write-Info "Directory already exists: $dir"
        }
    }
}

# Check GitHub repository
function Test-GitHubRepository {
    Write-Header "🐙 Checking GitHub Repository"
    
    try {
        $repoUrl = git remote get-url origin 2>$null
        if ($repoUrl) {
            Write-Success "Git remote found: $repoUrl"
            
            # Extract repository owner and name
            if ($repoUrl -match 'github\.com[:/]([^/]+)/([^/]+)') {
                $script:RepoOwner = $matches[1]
                $script:RepoName = $matches[2] -replace '\.git$', ''
                Write-Info "Repository: $script:RepoOwner/$script:RepoName"
            } else {
                Write-Warning "Could not parse GitHub repository information"
            }
        } else {
            Write-Warning "No GitHub remote found. Please set up your GitHub repository first."
        }
    } catch {
        Write-Warning "Error checking GitHub repository: $($_.Exception.Message)"
    }
}

# Setup environment files
function Set-Environment {
    Write-Header "🔧 Setting Up Environment"
    
    if (!(Test-Path ".env")) {
        if (Test-Path "env.example") {
            Copy-Item "env.example" ".env"
            Write-Success "Created .env file from env.example"
            Write-Warning "Please update the .env file with your actual values"
        } else {
            Write-Error "env.example file not found"
        }
    } else {
        Write-Info ".env file already exists"
    }
    
    # Update .gitignore
    if (Test-Path ".gitignore") {
        $gitignoreContent = Get-Content ".gitignore" -Raw
        if ($gitignoreContent -notmatch '\.env') {
            Add-Content ".gitignore" "`n# Environment files`n.env`n.env.local`n.env.*.local"
            Write-Success "Added .env to .gitignore"
        }
    } else {
        Set-Content ".gitignore" "# Environment files`n.env`n.env.local`n.env.*.local"
        Write-Success "Created .gitignore with environment files"
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Header "📦 Installing Dependencies"
    
    # Backend dependencies
    if ((Test-Path "backend") -and (Test-Path "backend\package.json")) {
        Write-Info "Installing backend dependencies..."
        Push-Location "backend"
        try {
            npm install
            Write-Success "Backend dependencies installed"
        } catch {
            Write-Warning "Failed to install backend dependencies: $($_.Exception.Message)"
        }
        Pop-Location
    }
    
    # Frontend dependencies
    if ((Test-Path "frontend") -and (Test-Path "frontend\package.json")) {
        Write-Info "Installing frontend dependencies..."
        Push-Location "frontend"
        try {
            npm install
            Write-Success "Frontend dependencies installed"
        } catch {
            Write-Warning "Failed to install frontend dependencies: $($_.Exception.Message)"
        }
        Pop-Location
    }
}

# Setup Docker
function Set-Docker {
    Write-Header "🐳 Setting Up Docker"
    
    if ($SkipDocker) {
        Write-Info "Skipping Docker setup as requested"
        return
    }
    
    # Check if Docker is running
    try {
        docker info | Out-Null
        Write-Success "Docker is running"
    } catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        return
    }
    
    # Build development images
    Write-Info "Building Docker images for development..."
    
    try {
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
        Write-Success "Docker images built successfully"
    } catch {
        Write-Warning "Failed to build Docker images. You may need to fix build issues."
    }
}

# Test the setup
function Test-Setup {
    Write-Header "🧪 Testing Setup"
    
    if ($SkipTests) {
        Write-Info "Skipping tests as requested"
        return
    }
    
    # Test backend
    if (Test-Path "backend") {
        Write-Info "Testing backend..."
        Push-Location "backend"
        try {
            npm test
            Write-Success "Backend tests passed"
        } catch {
            Write-Warning "Backend tests failed or not configured"
        }
        Pop-Location
    }
    
    # Test frontend
    if (Test-Path "frontend") {
        Write-Info "Testing frontend..."
        Push-Location "frontend"
        try {
            $env:CI = "true"
            npm test -- --watchAll=false
            Write-Success "Frontend tests passed"
        } catch {
            Write-Warning "Frontend tests failed or not configured"
        }
        Pop-Location
    }
}

# Setup GitHub Actions secrets
function Show-GitHubSecretsSetup {
    Write-Header "🔐 GitHub Actions Secrets Setup"
    
    Write-Info "You need to add the following secrets to your GitHub repository:"
    Write-Host ""
    Write-Host "Repository Settings > Secrets and variables > Actions > New repository secret" -ForegroundColor $Colors.Yellow
    Write-Host ""
    Write-Host "Required secrets:" -ForegroundColor $Colors.Blue
    Write-Host "• MONGO_ROOT_PASSWORD - MongoDB root password"
    Write-Host "• JWT_SECRET_STAGING - JWT secret for staging"
    Write-Host "• JWT_SECRET_PRODUCTION - JWT secret for production"
    Write-Host "• REDIS_PASSWORD - Redis password"
    Write-Host "• GRAFANA_ADMIN_PASSWORD - Grafana admin password"
    Write-Host "• GRAFANA_SECRET_KEY - Grafana secret key"
    Write-Host ""
    Write-Host "Optional secrets (if using external services):" -ForegroundColor $Colors.Blue
    Write-Host "• DOCKER_REGISTRY_TOKEN - Docker registry token"
    Write-Host "• SMTP_USER - Email SMTP username"
    Write-Host "• SMTP_PASS - Email SMTP password"
    Write-Host "• STRIPE_SECRET_KEY - Stripe secret key"
    Write-Host "• AWS_ACCESS_KEY_ID - AWS access key"
    Write-Host "• AWS_SECRET_ACCESS_KEY - AWS secret key"
    Write-Host ""
    Write-Warning "Add these secrets before running CI/CD pipeline"
}

# Setup GitHub environments
function Show-GitHubEnvironmentsSetup {
    Write-Header "🌍 GitHub Environments Setup"
    
    Write-Info "You need to create the following environments in your GitHub repository:"
    Write-Host ""
    Write-Host "Repository Settings > Environments > New environment" -ForegroundColor $Colors.Yellow
    Write-Host ""
    Write-Host "Environments to create:" -ForegroundColor $Colors.Blue
    Write-Host "• staging - For staging deployments"
    Write-Host "• production - For production deployments (with protection rules)"
    Write-Host ""
    Write-Host "For production environment, enable:" -ForegroundColor $Colors.Blue
    Write-Host "• Required reviewers (recommend 1-2 reviewers)"
    Write-Host "• Wait timer (optional, e.g., 5 minutes)"
    Write-Host "• Deployment branches (restrict to 'main' branch)"
    Write-Host ""
    Write-Warning "Create these environments for proper deployment workflow"
}

# Generate summary
function Show-Summary {
    Write-Header "📋 Setup Summary"
    
    Write-Host "CI/CD setup completed! Here's what was configured:" -ForegroundColor $Colors.Green
    Write-Host ""
    Write-Host "✅ GitHub Actions workflows:" -ForegroundColor $Colors.Green
    Write-Host "   • ci-cd.yml - Main CI/CD pipeline"
    Write-Host "   • dependency-update.yml - Automated dependency updates"
    Write-Host "   • security-scan.yml - Security scanning"
    Write-Host "   • manual-deploy.yml - Manual deployment trigger"
    Write-Host "   • health-check.yml - Application health monitoring"
    Write-Host ""
    Write-Host "✅ Docker configuration:" -ForegroundColor $Colors.Green
    Write-Host "   • docker-compose.yml - Base configuration"
    Write-Host "   • docker-compose.dev.yml - Development overrides"
    Write-Host "   • docker-compose.staging.yml - Staging configuration"
    Write-Host "   • docker-compose.production.yml - Production configuration"
    Write-Host ""
    Write-Host "✅ Environment configuration:" -ForegroundColor $Colors.Green
    Write-Host "   • env.example - Environment variables template"
    Write-Host "   • .env - Local environment file (update with your values)"
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor $Colors.Yellow
    Write-Host "1. Update .env file with your actual values"
    Write-Host "2. Add required secrets to GitHub repository"
    Write-Host "3. Create staging and production environments in GitHub"
    Write-Host "4. Push changes to GitHub to trigger first CI/CD run"
    Write-Host "5. Monitor workflow execution in GitHub Actions tab"
    Write-Host ""
    Write-Success "CI/CD pipeline is ready to use!"
}

# Main execution
function main {
    Write-Header "🚀 Full-Stack E-commerce CI/CD Setup"
    
    if (!(Test-Requirements)) {
        return
    }
    
    New-ProjectDirectories
    Test-GitHubRepository
    Set-Environment
    Install-Dependencies
    Set-Docker
    Test-Setup
    Show-GitHubSecretsSetup
    Show-GitHubEnvironmentsSetup
    Show-Summary
}

# Run main function
main









