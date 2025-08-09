#!/bin/bash

# ===========================================
# CI/CD Setup Script for Full-Stack E-commerce
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}=============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=============================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_header "🔍 Checking Requirements"
    
    local missing_tools=()
    
    command -v docker >/dev/null 2>&1 || missing_tools+=("docker")
    command -v docker-compose >/dev/null 2>&1 || missing_tools+=("docker-compose")
    command -v git >/dev/null 2>&1 || missing_tools+=("git")
    command -v node >/dev/null 2>&1 || missing_tools+=("node")
    command -v npm >/dev/null 2>&1 || missing_tools+=("npm")
    
    if [ ${#missing_tools[@]} -eq 0 ]; then
        print_success "All required tools are installed"
    else
        print_error "Missing required tools: ${missing_tools[*]}"
        echo "Please install the missing tools and run the script again."
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    print_header "📁 Creating Directories"
    
    directories=(
        ".github/workflows"
        "scripts"
        "nginx"
        "ssl"
        "monitoring"
        "mongodb"
        "redis"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_success "Created directory: $dir"
        else
            print_info "Directory already exists: $dir"
        fi
    done
}

# Check GitHub repository
check_github_repo() {
    print_header "🐙 Checking GitHub Repository"
    
    if git remote get-url origin >/dev/null 2>&1; then
        REPO_URL=$(git remote get-url origin)
        print_success "Git remote found: $REPO_URL"
        
        # Extract repository owner and name
        if [[ $REPO_URL =~ github\.com[:/]([^/]+)/([^/]+) ]]; then
            REPO_OWNER="${BASH_REMATCH[1]}"
            REPO_NAME="${BASH_REMATCH[2]%.git}"
            print_info "Repository: $REPO_OWNER/$REPO_NAME"
        else
            print_warning "Could not parse GitHub repository information"
        fi
    else
        print_warning "No GitHub remote found. Please set up your GitHub repository first."
    fi
}

# Setup environment files
setup_environment() {
    print_header "🔧 Setting Up Environment"
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            print_success "Created .env file from env.example"
            print_warning "Please update the .env file with your actual values"
        else
            print_error "env.example file not found"
        fi
    else
        print_info ".env file already exists"
    fi
    
    # Update .gitignore
    if [ -f ".gitignore" ]; then
        if ! grep -q "^\.env$" .gitignore; then
            echo -e "\n# Environment files\n.env\n.env.local\n.env.*.local" >> .gitignore
            print_success "Added .env to .gitignore"
        fi
    else
        echo -e "# Environment files\n.env\n.env.local\n.env.*.local" > .gitignore
        print_success "Created .gitignore with environment files"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "📦 Installing Dependencies"
    
    # Backend dependencies
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        print_info "Installing backend dependencies..."
        cd backend
        npm install
        print_success "Backend dependencies installed"
        cd ..
    fi
    
    # Frontend dependencies
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        print_info "Installing frontend dependencies..."
        cd frontend
        npm install
        print_success "Frontend dependencies installed"
        cd ..
    fi
}

# Setup Docker
setup_docker() {
    print_header "🐳 Setting Up Docker"
    
    # Check if Docker is running
    if docker info >/dev/null 2>&1; then
        print_success "Docker is running"
    else
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Build development images
    print_info "Building Docker images for development..."
    
    if docker-compose -f docker-compose.yml -f docker-compose.dev.yml build; then
        print_success "Docker images built successfully"
    else
        print_warning "Failed to build Docker images. You may need to fix build issues."
    fi
}

# Test the setup
test_setup() {
    print_header "🧪 Testing Setup"
    
    # Test backend
    if [ -d "backend" ]; then
        print_info "Testing backend..."
        cd backend
        if npm test; then
            print_success "Backend tests passed"
        else
            print_warning "Backend tests failed or not configured"
        fi
        cd ..
    fi
    
    # Test frontend
    if [ -d "frontend" ]; then
        print_info "Testing frontend..."
        cd frontend
        if npm test -- --watchAll=false; then
            print_success "Frontend tests passed"
        else
            print_warning "Frontend tests failed or not configured"
        fi
        cd ..
    fi
}

# Setup GitHub Actions secrets
setup_github_secrets() {
    print_header "🔐 GitHub Actions Secrets Setup"
    
    print_info "You need to add the following secrets to your GitHub repository:"
    echo ""
    echo "Repository Settings > Secrets and variables > Actions > New repository secret"
    echo ""
    echo "Required secrets:"
    echo "• MONGO_ROOT_PASSWORD - MongoDB root password"
    echo "• JWT_SECRET_STAGING - JWT secret for staging"
    echo "• JWT_SECRET_PRODUCTION - JWT secret for production"
    echo "• REDIS_PASSWORD - Redis password"
    echo "• GRAFANA_ADMIN_PASSWORD - Grafana admin password"
    echo "• GRAFANA_SECRET_KEY - Grafana secret key"
    echo ""
    echo "Optional secrets (if using external services):"
    echo "• DOCKER_REGISTRY_TOKEN - Docker registry token"
    echo "• SMTP_USER - Email SMTP username"
    echo "• SMTP_PASS - Email SMTP password"
    echo "• STRIPE_SECRET_KEY - Stripe secret key"
    echo "• AWS_ACCESS_KEY_ID - AWS access key"
    echo "• AWS_SECRET_ACCESS_KEY - AWS secret key"
    echo ""
    print_warning "Add these secrets before running CI/CD pipeline"
}

# Setup GitHub environments
setup_github_environments() {
    print_header "🌍 GitHub Environments Setup"
    
    print_info "You need to create the following environments in your GitHub repository:"
    echo ""
    echo "Repository Settings > Environments > New environment"
    echo ""
    echo "Environments to create:"
    echo "• staging - For staging deployments"
    echo "• production - For production deployments (with protection rules)"
    echo ""
    echo "For production environment, enable:"
    echo "• Required reviewers (recommend 1-2 reviewers)"
    echo "• Wait timer (optional, e.g., 5 minutes)"
    echo "• Deployment branches (restrict to 'main' branch)"
    echo ""
    print_warning "Create these environments for proper deployment workflow"
}

# Generate summary
generate_summary() {
    print_header "📋 Setup Summary"
    
    echo "CI/CD setup completed! Here's what was configured:"
    echo ""
    echo "✅ GitHub Actions workflows:"
    echo "   • ci-cd.yml - Main CI/CD pipeline"
    echo "   • dependency-update.yml - Automated dependency updates"
    echo "   • security-scan.yml - Security scanning"
    echo "   • manual-deploy.yml - Manual deployment trigger"
    echo "   • health-check.yml - Application health monitoring"
    echo ""
    echo "✅ Docker configuration:"
    echo "   • docker-compose.yml - Base configuration"
    echo "   • docker-compose.dev.yml - Development overrides"
    echo "   • docker-compose.staging.yml - Staging configuration"
    echo "   • docker-compose.production.yml - Production configuration"
    echo ""
    echo "✅ Environment configuration:"
    echo "   • env.example - Environment variables template"
    echo "   • .env - Local environment file (update with your values)"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update .env file with your actual values"
    echo "2. Add required secrets to GitHub repository"
    echo "3. Create staging and production environments in GitHub"
    echo "4. Push changes to GitHub to trigger first CI/CD run"
    echo "5. Monitor workflow execution in GitHub Actions tab"
    echo ""
    print_success "CI/CD pipeline is ready to use!"
}

# Main execution
main() {
    print_header "🚀 Full-Stack E-commerce CI/CD Setup"
    
    check_requirements
    create_directories
    check_github_repo
    setup_environment
    install_dependencies
    setup_docker
    test_setup
    setup_github_secrets
    setup_github_environments
    generate_summary
}

# Run main function
main
