# Deployment Guide

This guide covers deploying the Orbital AI Explorer to production.

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- PostgreSQL (if not using Docker)
- API keys (NASA, OpenAI)

### Quick Start with Docker Compose

1. **Clone the repository:**
```bash
git clone https://github.com/XnickX01/orbital-ai-explorer.git
cd orbital-ai-explorer
```

2. **Set environment variables:**
```bash
# Create a .env file in the root directory
cat > .env << EOF
NASA_API_KEY=your_nasa_api_key
OPENAI_API_KEY=your_openai_api_key
EOF
```

3. **Start all services:**
```bash
docker-compose up -d
```

4. **Initialize the database:**
The database schema will be automatically loaded on first startup.

5. **Access the application:**
- Frontend: http://localhost:3000
- Express API: http://localhost:5000
- FastAPI: http://localhost:8000
- FastAPI Docs: http://localhost:8000/docs

### Production Build

For production deployment, update the Dockerfiles to use multi-stage builds:

**Frontend Dockerfile (production):**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Cloud Deployment

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Build and push Docker images:**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL

# Build and tag images
docker build -t orbital-frontend ./frontend
docker build -t orbital-express ./backend/express
docker build -t orbital-fastapi ./backend/fastapi

# Tag for ECR
docker tag orbital-frontend:latest YOUR_ECR_URL/orbital-frontend:latest
docker tag orbital-express:latest YOUR_ECR_URL/orbital-express:latest
docker tag orbital-fastapi:latest YOUR_ECR_URL/orbital-fastapi:latest

# Push to ECR
docker push YOUR_ECR_URL/orbital-frontend:latest
docker push YOUR_ECR_URL/orbital-express:latest
docker push YOUR_ECR_URL/orbital-fastapi:latest
```

2. **Set up RDS PostgreSQL:**
- Create an RDS PostgreSQL instance
- Configure security groups to allow access from ECS tasks
- Run the schema.sql to initialize the database

3. **Create ECS task definitions and services:**
- Define tasks for each container
- Configure environment variables
- Set up load balancer
- Configure auto-scaling

#### Using Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize and deploy:
```bash
eb init -p docker orbital-ai-explorer
eb create orbital-ai-explorer-env
```

### Vercel Deployment (Frontend)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy frontend:**
```bash
cd frontend
vercel --prod
```

3. **Configure environment variables in Vercel dashboard:**
- VITE_EXPRESS_API_URL
- VITE_FASTAPI_URL

### Heroku Deployment

#### Express Backend

```bash
cd backend/express
heroku create orbital-express
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### FastAPI Backend

```bash
cd backend/fastapi
heroku create orbital-fastapi
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

## Database Setup

### PostgreSQL Production Configuration

1. **Create database:**
```sql
CREATE DATABASE orbital_explorer;
```

2. **Create user:**
```sql
CREATE USER orbital_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE orbital_explorer TO orbital_user;
```

3. **Run schema:**
```bash
psql -U orbital_user -d orbital_explorer -f database/schema.sql
```

4. **Configure connection pooling:**
Use PgBouncer for production connection pooling.

## Environment Variables

### Production Environment Variables

**Express Backend:**
```
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=orbital_explorer
DB_USER=orbital_user
DB_PASSWORD=secure_password
NASA_API_KEY=your_nasa_api_key
```

**FastAPI Backend:**
```
DATABASE_URL=postgresql://orbital_user:secure_password@your-db-host:5432/orbital_explorer
OPENAI_API_KEY=your_openai_api_key
CHROMA_PERSIST_DIRECTORY=/app/chroma_db
ENVIRONMENT=production
```

**Frontend:**
```
VITE_EXPRESS_API_URL=https://your-api-domain.com
VITE_FASTAPI_URL=https://your-ai-api-domain.com
```

## Monitoring and Logging

### Application Monitoring

1. **Install monitoring tools:**
```bash
npm install @sentry/node @sentry/tracing
```

2. **Configure Sentry (Express):**
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Logging

Use structured logging in production:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## Security Best Practices

1. **Use HTTPS in production**
2. **Enable rate limiting**
3. **Implement authentication and authorization**
4. **Sanitize user inputs**
5. **Keep dependencies updated**
6. **Use secrets management (AWS Secrets Manager, HashiCorp Vault)**
7. **Configure CORS properly**
8. **Enable database SSL connections**

## Performance Optimization

1. **Enable caching:**
   - Redis for API responses
   - CDN for static assets

2. **Database optimization:**
   - Create appropriate indexes
   - Use connection pooling
   - Optimize queries

3. **Frontend optimization:**
   - Code splitting
   - Lazy loading
   - Asset optimization
   - Enable gzip compression

## Backup and Recovery

1. **Database backups:**
```bash
# Automated daily backups
pg_dump -U orbital_user orbital_explorer > backup_$(date +%Y%m%d).sql
```

2. **Automated backup script:**
```bash
#!/bin/bash
BACKUP_DIR=/backups
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U orbital_user orbital_explorer | gzip > $BACKUP_DIR/orbital_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "orbital_*.sql.gz" -mtime +7 -delete
```

## Scaling

### Horizontal Scaling

1. **Load balancer configuration**
2. **Multiple instances of each service**
3. **Shared PostgreSQL instance or read replicas**
4. **Redis for shared session storage**

### Vertical Scaling

1. **Increase instance sizes**
2. **Optimize database performance**
3. **Add more PostgreSQL resources**

## Monitoring Checklist

- [ ] Application health checks
- [ ] Database performance monitoring
- [ ] API response times
- [ ] Error tracking
- [ ] Resource utilization (CPU, memory, disk)
- [ ] Log aggregation
- [ ] Uptime monitoring
- [ ] Alert configuration

## Troubleshooting

### Common Issues

1. **Database connection issues:**
   - Check connection string
   - Verify network access
   - Check credentials

2. **API errors:**
   - Check logs
   - Verify environment variables
   - Check external API quotas

3. **Performance issues:**
   - Monitor database queries
   - Check API response times
   - Review error logs

## Support

For deployment issues, please:
1. Check the logs
2. Review environment variables
3. Verify network connectivity
4. Open an issue on GitHub
