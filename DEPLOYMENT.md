# 🚀 Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Smart contract deployed and verified
- [ ] Database schema migrated
- [ ] Tested on staging/testnet
- [ ] Security review completed
- [ ] Backup strategy in place

---

## 1. Database Setup (PostgreSQL)

### Option A: Vercel Postgres (Recommended for Vercel deployments)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Link your project
vercel link

# Create Postgres database
vercel postgres create

# Get connection string
vercel env pull
```

### Option B: Railway.app

1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy `DATABASE_URL` from connection info
4. Add to your environment variables

### Option C: Supabase

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Option D: Self-hosted

```bash
# Using Docker
docker run --name postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=chiliz_app \
  -p 5432:5432 \
  -d postgres:15

# Connection string
postgresql://postgres:yourpassword@localhost:5432/chiliz_app
```

---

## 2. Environment Variables

### Production .env

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Security - GENERATE NEW SECRET!
JWT_SECRET="production-secret-min-32-chars-random"

# Blockchain
CHAIN_RPC_URL="https://rpc.ankr.com/chiliz"
CHZ_TOKEN_ADDRESS="0x..."
PAYMENT_CONTRACT_ADDRESS="0x..."
STAKING_CONTRACT_ADDRESS="0x..."

# Payment amounts (calculate based on current CHZ price)
FIXED_CHZ_AMOUNT="1000000000000000000000"
MIN_STAKED_AMOUNT_CHZ="500000000000000000000"

# Wallets
WALLET_1="0x..."
WALLET_2="0x..."

# Environment
NODE_ENV="production"
```

### Generate Secure JWT Secret

```bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 3. Deploy Smart Contract

### Using Remix IDE (Easiest)

1. Open https://remix.ethereum.org
2. Create new file: `ChzPaymentSplitter.sol`
3. Copy contract from `contracts/ChzPaymentSplitter.sol`
4. Compile with Solidity 0.8.20
5. Connect MetaMask to Chiliz mainnet
6. Deploy with constructor params:
   - `_chzToken`: CHZ token address
   - `_wallet1`: Your wallet 1 address
   - `_wallet2`: Your wallet 2 address
   - `_fixedAmount`: Payment amount in smallest unit
7. Copy deployed contract address
8. Verify on block explorer (optional but recommended)

### Using Hardhat

```bash
# 1. Install dependencies
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox dotenv

# 2. Add deployer private key to .env
DEPLOYER_PRIVATE_KEY="your-private-key-here"

# 3. Deploy
npx hardhat run scripts/deploy.ts --network chiliz

# 4. Verify contract (optional)
npx hardhat verify --network chiliz \
  DEPLOYED_CONTRACT_ADDRESS \
  CHZ_TOKEN_ADDRESS \
  WALLET_1 \
  WALLET_2 \
  FIXED_CHZ_AMOUNT
```

---

## 4. Deploy to Vercel

### Step-by-Step

```bash
# 1. Install Vercel CLI
pnpm add -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

### Configure in Vercel Dashboard

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env`
4. Redeploy if needed

### Build Settings

Vercel auto-detects Next.js, but verify:
- **Framework Preset:** Next.js
- **Build Command:** `pnpm build` or `npm run build`
- **Output Directory:** `.next` (default)
- **Install Command:** `pnpm install` or `npm install`

### Post-Deploy Commands

Vercel doesn't run migrations automatically. Two options:

**Option 1: Manual migration**
```bash
# Connect to your production database
DATABASE_URL="your-prod-db-url" npx prisma migrate deploy
```

**Option 2: Add build script**
Update `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## 5. Deploy to Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add environment variables
railway variables set JWT_SECRET="..."
railway variables set DATABASE_URL="..."
# ... add all other variables

# 5. Deploy
railway up
```

### Railway Configuration

Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && npx prisma generate && pnpm build"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "healthcheckPath": "/api/auth/me",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 6. Deploy to Your Own Server (VPS)

### Using PM2 + Nginx

```bash
# 1. Clone repository
git clone your-repo-url
cd chiliz-ja

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env
nano .env  # Edit with production values

# 4. Generate Prisma Client
npx prisma generate

# 5. Run migrations
npx prisma migrate deploy

# 6. Build Next.js
pnpm build

# 7. Install PM2
pnpm add -g pm2

# 8. Start with PM2
pm2 start pnpm --name "chiliz-app" -- start

# 9. Setup PM2 to start on boot
pm2 startup
pm2 save
```

### Nginx Configuration

Create `/etc/nginx/sites-available/chiliz-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/chiliz-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 7. Post-Deployment

### Database Migration

```bash
# Connect to production database and run
npx prisma migrate deploy
```

### Verify Deployment

Test all endpoints:
```bash
# Health check
curl https://your-domain.com/api/auth/me

# Should return 401 (not authenticated) but proves API works
```

### Monitor Application

```bash
# Using PM2
pm2 logs chiliz-app
pm2 monit

# Check database
npx prisma studio --browser none
```

---

## 8. Security Checklist

### SSL/TLS
- [ ] HTTPS enabled
- [ ] Force HTTPS redirect
- [ ] Valid SSL certificate

### Environment Variables
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] No secrets in code
- [ ] Database credentials secure

### API Security
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Input validation with Zod
- [ ] SQL injection protected (Prisma)

### Session Security
- [ ] HTTP-only cookies
- [ ] Secure flag in production
- [ ] SameSite attribute set
- [ ] Session expiration configured

### Smart Contract
- [ ] Contract verified on block explorer
- [ ] Audit completed (if handling significant funds)
- [ ] Ownership transferred to multisig (if applicable)

---

## 9. Monitoring & Logging

### Add Sentry (Error Tracking)

```bash
pnpm add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Add Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
}
```

### Database Monitoring

- Use Prisma Pulse for real-time monitoring
- Set up alerts for slow queries
- Monitor connection pool

---

## 10. Backup Strategy

### Database Backups

```bash
# Automated daily backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20251122.sql
```

### Setup Automated Backups

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

### Backup Script Example

```bash
#!/bin/bash
# backup-script.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="chiliz_app"

pg_dump $DATABASE_URL > "$BACKUP_DIR/backup-$DATE.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "backup-*.sql" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/backup-$DATE.sql" s3://your-bucket/backups/
```

---

## 11. Performance Optimization

### Enable Caching

```typescript
// app/api/staking/status/route.ts
export const revalidate = 60; // Cache for 60 seconds
```

### Database Indexing

Already done in Prisma schema:
- User address (unique index)
- Session token (index)
- Payment txHash (index)

### Connection Pooling

Prisma automatically handles connection pooling. For production, consider:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=10"
```

---

## 12. CI/CD Pipeline (GitHub Actions)

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
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Generate Prisma Client
        run: npx prisma generate
        
      - name: Run tests
        run: pnpm test
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🎉 Deployment Complete!

Your app is now live. Monitor for:
- Error rates
- Response times
- Database performance
- User activity

### Useful Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs chiliz-app --lines 100

# Restart app
pm2 restart chiliz-app

# Monitor database
npx prisma studio
```

---

**Remember:** Always test on staging before deploying to production!
