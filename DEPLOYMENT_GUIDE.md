# 🌍 TravelBudget — Complete Deployment Guide

## What You're Deploying
- **Frontend** (React + Vite) → Vercel (free)
- **Backend** (Node.js + Express) → Render (free)
- **Database** (MongoDB) → MongoDB Atlas (free)
- **Photo Storage** (Images) → Cloudinary (free)

---

## STEP 1: MongoDB Atlas (Database) — 5 minutes

1. Go to **https://cloud.mongodb.com** → Sign up free
2. Create a **free cluster** (M0 tier, choose a region)
3. Create a database user:
   - Go to **Database Access** → Add New Database User
   - Username: `travelbudget` / Password: (save this!)
4. Allow network access:
   - Go to **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
5. Get your connection string:
   - Go to **Clusters** → Connect → Connect your application
   - Copy the string, it looks like:
     `mongodb+srv://travelbudget:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `PASSWORD` with your actual password
   - Add `/travel-budget` before the `?`: 
     `mongodb+srv://travelbudget:PASSWORD@cluster0.xxxxx.mongodb.net/travel-budget?retryWrites=true&w=majority`
mongodb+srv://travelbudget_db_user:Workable&567@cluster0.0zck3qh.mongodb.net/travel-budget?appName=Cluster0
---

## STEP 2: Cloudinary (Photo Storage) — 3 minutes

1. Go to **https://cloudinary.com** → Sign up free
2. After login, go to your **Dashboard**
3. You'll see your credentials:
   - Cloud name
   - API Key
   - API Secret
4. **Save all three** — you'll need them for the backend


dm2scdqud
991728399769692
lX9eLSm95q6_fGxiZLDfk6Iqn30
---

## STEP 3: Gmail App Password (for OTP emails) — 3 minutes

1. Go to **https://myaccount.google.com/security**
2. Enable **2-Step Verification** (if not already done)
3. Search for **"App passwords"** → Create one → App: Mail, Device: Other (name it "TravelBudget")
4. Copy the 16-character password shown

---

## STEP 4: Deploy Backend on Render — 10 minutes

1. Push your code to **GitHub**:
   ```
   cd TravelBudgetTool
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Then create a new repo on GitHub and push:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/travel-budget.git
   git branch -M main
   git push -u origin main
   ```

2. Go to **https://render.com** → Sign up free → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Name**: travel-budget-backend
   - **Root Directory**: `Backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. Add **Environment Variables** (click "Add Environment Variable"):
   ```
   SERVER_PORT          = 3001
   DATABASE_URL         = (your MongoDB connection string from Step 1)
   JWT_SECRET           = (any long random string, e.g. myS3cr3tK3y2025TravelBudget!)
   EMAIL_USER           = (your Gmail address)
   EMAIL_PASS           = (your Gmail app password from Step 3)
   CLOUDINARY_CLOUD_NAME = (from Step 2)
   CLOUDINARY_API_KEY   = (from Step 2)
   CLOUDINARY_API_SECRET = (from Step 2)
   ALLOWED_ORIGINS      = http://localhost:5173 (update later after frontend deploy)
   ```

6. Click **Deploy** → Wait 3-5 minutes
7. Once deployed, copy your backend URL (e.g. `https://travel-budget-backend.onrender.com`)

---

## STEP 5: Deploy Frontend on Vercel — 5 minutes

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **New Project** → Import your GitHub repo
3. Settings:
   - **Root Directory**: `Frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variable**:
   ```
   VITE_API_URL = https://travel-budget-backend.onrender.com/user
   ```
   *(Replace with your actual Render URL from Step 4)*

5. Click **Deploy** → Wait 2 minutes
6. Copy your frontend URL (e.g. `https://travel-budget.vercel.app`)

---

## STEP 6: Update CORS on Backend — 2 minutes

1. Go back to **Render** → Your backend service → **Environment**
2. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   ALLOWED_ORIGINS = http://localhost:5173,https://travel-budget.vercel.app
   ```
3. Click **Save Changes** → Render will auto-redeploy

---

## ✅ You're Live!

Your app is now accessible at your Vercel URL. Share it with your client!

- **Frontend**: https://travel-budget.vercel.app (or your custom URL)
- **Backend**: https://travel-budget-backend.onrender.com

---

## ⚠️ Important Notes

**Free tier limitations:**
- Render free tier **spins down** after 15 minutes of inactivity → first request after idle takes ~30 seconds to wake up. Upgrade to $7/month paid plan to avoid this for a live client demo.
- MongoDB Atlas free tier: 512MB storage (plenty for expenses)
- Cloudinary free tier: 25GB storage, 25GB bandwidth/month (very generous)

**For client handover:**
- You can add a **custom domain** on Vercel (free) → Project Settings → Domains
- The client just visits the URL to use the app — no installation needed

---

## Local Development

```bash
# Backend
cd Backend
cp .env.example .env
# Fill in your .env with real values
npm install
npm run dev

# Frontend (new terminal)
cd Frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:3001/user
npm install
npm run dev
```

App runs at http://localhost:5173
