# MedReport AI - Deployment Guide

This guide provides comprehensive instructions for deploying the MedReport AI application to various platforms.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)

**One-click deployment:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/medreport-ai)

**Manual deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 2. Netlify

**One-click deployment:**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/medreport-ai)

**Manual deployment:**
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### 3. Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

## 🐳 Docker Deployment

### Local Docker Deployment

```bash
# Build the Docker image
docker build -t medreport-ai .

# Run the container
docker run -p 3000:80 medreport-ai

# Or use docker-compose
docker-compose up -d
```

### Docker Compose with Full Stack

```bash
# Start all services
docker-compose --profile production up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ Cloud Platform Deployment

### AWS (ECS/Fargate)

1. **Create ECR Repository:**
```bash
aws ecr create-repository --repository-name medreport-ai
```

2. **Build and Push Image:**
```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

# Build and tag image
docker build -t medreport-ai .
docker tag medreport-ai:latest your-account.dkr.ecr.us-east-1.amazonaws.com/medreport-ai:latest

# Push to ECR
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/medreport-ai:latest
```

3. **Deploy to ECS:**
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name medreport-ai

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service --cluster medreport-ai --service-name medreport-ai --task-definition medreport-ai:1
```

### Google Cloud Platform (GKE)

```bash
# Create GKE cluster
gcloud container clusters create medreport-ai --zone us-central1-a

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/your-project/medreport-ai

# Deploy to GKE
kubectl apply -f k8s/
```

### Azure (AKS)

```bash
# Create AKS cluster
az aks create --resource-group medreport-rg --name medreport-aks --node-count 1

# Build and push to Azure Container Registry
az acr build --registry yourregistry --image medreport-ai .

# Deploy to AKS
kubectl apply -f k8s/
```

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file or set these in your deployment platform:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services (Optional)
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key

# Analytics and Monitoring
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=false

# API Configuration
VITE_API_URL=https://api.medreport-ai.com

# Development Settings
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
```

### Supabase Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migrations:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

3. **Set up Storage:**
   - Go to Storage in Supabase dashboard
   - Create bucket named `medical-reports`
   - Set RLS policies for security

4. **Deploy Edge Functions:**
```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy analyze-report
```

## 🔒 Security Configuration

### SSL/TLS Setup

**For Vercel/Netlify:** Automatic SSL

**For Custom Domains:**
```bash
# Install certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure nginx with SSL
# See nginx.conf for SSL configuration
```

### Security Headers

The application includes security headers in `nginx.conf`:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 📊 Monitoring and Analytics

### Application Monitoring

1. **Sentry Setup:**
```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Configure Sentry
sentry-cli init
```

2. **Health Checks:**
```bash
# Check application health
curl https://yourdomain.com/health

# Check database connectivity
curl https://yourdomain.com/api/health
```

### Performance Monitoring

1. **Lighthouse CI:**
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run performance audit
lhci autorun
```

2. **Web Vitals Monitoring:**
```javascript
// The application includes built-in performance monitoring
// See src/hooks/usePerformance.ts for details
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_HOOK
  only:
    - main
```

## 🚀 Production Checklist

### Before Deployment

- [ ] Set all required environment variables
- [ ] Configure Supabase project and run migrations
- [ ] Set up custom domain (if applicable)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and analytics
- [ ] Test the application thoroughly
- [ ] Review security settings

### After Deployment

- [ ] Verify all features work correctly
- [ ] Check performance metrics
- [ ] Monitor error logs
- [ ] Test file upload functionality
- [ ] Verify AI analysis works
- [ ] Check mobile responsiveness
- [ ] Test offline functionality

### Performance Optimization

- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Optimize images and assets
- [ ] Enable caching strategies
- [ ] Monitor Core Web Vitals

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

2. **Environment Variables:**
```bash
# Verify environment variables are set
echo $VITE_SUPABASE_URL
```

3. **Database Connection:**
```bash
# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your-anon-key"
```

4. **File Upload Issues:**
- Check Supabase storage bucket permissions
- Verify RLS policies are correct
- Check file size limits

### Support

For deployment issues:

1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Review security policies
5. Contact support at support@medreport-ai.com

## 📈 Scaling Considerations

### Horizontal Scaling

- Use load balancers for multiple instances
- Configure auto-scaling policies
- Implement proper session management

### Database Scaling

- Consider Supabase Pro for higher limits
- Implement connection pooling
- Use read replicas for heavy queries

### CDN Configuration

- Configure CDN for static assets
- Enable edge caching
- Set up proper cache headers

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit secrets to version control
   - Use secure secret management
   - Rotate keys regularly

2. **Database Security:**
   - Enable RLS policies
   - Use least privilege access
   - Monitor database access

3. **Application Security:**
   - Keep dependencies updated
   - Implement rate limiting
   - Use HTTPS everywhere

4. **Monitoring:**
   - Set up error tracking
   - Monitor performance metrics
   - Implement security logging

---

For additional support or questions about deployment, please refer to our [documentation](https://docs.medreport-ai.com) or contact our support team. 