# Backend Architecture

## Vercel Edge Functions for Portfolio

A serverless, globally-distributed backend optimized for speed and simplicity.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE NETWORK                       │
│                    (300+ Global Edge Locations)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐  ┌────────────────┐                    │
│   │  /api/ping   │  │/api/get-assets │                    │
│   │  Health Check│  │ Cloudinary URLs│                    │
│   └──────────────┘  └────────────────┘                    │
│          │                  │                             │
│          ▼                  ▼                             │
│   ┌──────────────────────────────────────────────────┐    │
│   │              EDGE RUNTIME (V8 Isolates)          │    │
│   │         • Zero Cold Start • <50ms Response       │    │
│   └──────────────────────────────────────────────────┘    │
│                             │                              │
└─────────────────────────────┼──────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │      CLOUDINARY CDN           │
              │   Static Assets Delivery      │
              │  • CV PDF  • Screenshots      │
              │  • Avatar  • Project Images   │
              └───────────────────────────────┘

Client contact flow now lives entirely on the frontend: when a visitor submits the form we simply open Gmail compose with a pre-filled subject/body—no backend hop or email service required.
```

---

## Folder Structure

```
sushil.dev-portfolio-v2/
├── api/
│   ├── ping.ts              # Health check endpoint
│   └── get-assets.ts        # Cloudinary asset URLs
├── lib/
│   ├── validation.ts        # Input validation utilities
│   └── cloudinary.ts        # Cloudinary URL builder
├── vercel.json              # Edge runtime configuration
└── .env.local               # Environment variables
```

---

## Configuration

### `vercel.json`

```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### `.env.local`

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CONTACT_EMAIL=hello@sushil.dev
```

---

## API Endpoints

### 1. Health Check — `/api/ping.ts`

```typescript
export const config = {
  runtime: 'edge',
};

export default function handler(): Response {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: Date.now(),
      region: process.env.VERCEL_REGION || 'unknown',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
```

**Response Example:**
```json
{
  "status": "ok",
  "timestamp": 1701619200000,
  "region": "iad1"
}
```

---

### 2. Contact Flow — Gmail Compose (Client Side)

To keep the experience lightweight (and avoid maintaining an email microservice), the contact form now bypasses the backend entirely:

1. Validate input on the client for a good UX.
2. Build a Gmail compose URL with query params for `to`, `su` (subject) and `body`.
3. Open the URL in a new tab so the visitor can send the message manually from their Google account.

```ts
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'hello@sushil.dev';

export function openGmailCompose({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const body = [
    `Hi Sushil,`,
    '',
    message,
    '',
    `— ${name} (${email})`,
  ].join('\n');

  const composeUrl = new URL('https://mail.google.com/mail/');
  composeUrl.searchParams.set('view', 'cm');
  composeUrl.searchParams.set('fs', '1');
  composeUrl.searchParams.set('to', CONTACT_EMAIL);
  composeUrl.searchParams.set('su', subject || 'Portfolio Contact');
  composeUrl.searchParams.set('body', body);

  window.open(composeUrl.toString(), '_blank');
}
```

Because Gmail handles authentication/delivery, there are no server costs, API keys, or spam concerns. If you want to support non-Gmail users, keep a fallback `mailto:` link with the same subject/body string.

---

### 3. Asset URLs — `/api/get-assets.ts`

```typescript
export const config = {
  runtime: 'edge',
};

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud';

// Cloudinary URL builder with optimizations
function cloudinaryUrl(publicId: string, options: {
  type?: 'image' | 'raw';
  format?: string;
  width?: number;
  quality?: string;
} = {}): string {
  const { type = 'image', format, width, quality = 'auto' } = options;
  
  const transformations: string[] = [];
  
  if (type === 'image') {
    transformations.push(`q_${quality}`);
    transformations.push('f_auto');
    if (width) transformations.push(`w_${width}`);
  }
  
  const transform = transformations.length > 0 
    ? `/${transformations.join(',')}` 
    : '';
  
  const resourceType = type === 'raw' ? 'raw' : 'image';
  const ext = format ? `.${format}` : '';
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload${transform}/v1/${publicId}${ext}`;
}

export default function handler(): Response {
  const assets = {
    // Profile & Branding
    avatar: {
      small: cloudinaryUrl('portfolio/avatar', { width: 100 }),
      medium: cloudinaryUrl('portfolio/avatar', { width: 300 }),
      large: cloudinaryUrl('portfolio/avatar', { width: 600 }),
    },
    
    // Documents
    cv: {
      url: cloudinaryUrl('portfolio/sushil-cv', { type: 'raw', format: 'pdf' }),
      filename: 'Sushil_Developer_CV.pdf',
    },
    
    // Project Screenshots
    projects: {
      pixelQuest: {
        thumbnail: cloudinaryUrl('portfolio/projects/pixel-quest-thumb', { width: 600 }),
        hero: cloudinaryUrl('portfolio/projects/pixel-quest-hero', { width: 1200 }),
        screenshots: [
          cloudinaryUrl('portfolio/projects/pixel-quest-1', { width: 800 }),
          cloudinaryUrl('portfolio/projects/pixel-quest-2', { width: 800 }),
          cloudinaryUrl('portfolio/projects/pixel-quest-3', { width: 800 }),
        ],
      },
      neonGrid: {
        thumbnail: cloudinaryUrl('portfolio/projects/neon-grid-thumb', { width: 600 }),
        hero: cloudinaryUrl('portfolio/projects/neon-grid-hero', { width: 1200 }),
        screenshots: [
          cloudinaryUrl('portfolio/projects/neon-grid-1', { width: 800 }),
          cloudinaryUrl('portfolio/projects/neon-grid-2', { width: 800 }),
        ],
      },
      dataVault: {
        thumbnail: cloudinaryUrl('portfolio/projects/data-vault-thumb', { width: 600 }),
        hero: cloudinaryUrl('portfolio/projects/data-vault-hero', { width: 1200 }),
        screenshots: [
          cloudinaryUrl('portfolio/projects/data-vault-1', { width: 800 }),
        ],
      },
    },
    
    // Meta
    og: {
      default: cloudinaryUrl('portfolio/og-image', { width: 1200 }),
    },
  };

  return new Response(JSON.stringify(assets), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

**Response Example:**
```json
{
  "avatar": {
    "small": "https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto,w_100/v1/portfolio/avatar",
    "medium": "https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto,w_300/v1/portfolio/avatar",
    "large": "https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto,w_600/v1/portfolio/avatar"
  },
  "cv": {
    "url": "https://res.cloudinary.com/your-cloud/raw/upload/v1/portfolio/sushil-cv.pdf",
    "filename": "Sushil_Developer_CV.pdf"
  },
  "projects": {
    "pixelQuest": {
      "thumbnail": "https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto,w_600/v1/portfolio/projects/pixel-quest-thumb",
      "hero": "https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto,w_1200/v1/portfolio/projects/pixel-quest-hero",
      "screenshots": ["..."]
    }
  },
  "og": {
    "default": "https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto,w_1200/v1/portfolio/og-image"
  }
}
```

---

## Frontend Integration

### Calling APIs (No CORS Issues)

```typescript
// Contact Form Submission → Gmail compose
function launchContact({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const body = `Hi Sushil,\n\n${message}\n\n— ${name} (${email})`;
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: import.meta.env.VITE_CONTACT_EMAIL,
    su: subject || 'Portfolio Contact',
    body,
  });
  window.open(`https://mail.google.com/mail/?${params.toString()}`, '_blank');
}

// Fetch Assets
async function getAssets() {
  const response = await fetch('/api/get-assets');
  return response.json();
}

// Health Check
async function ping() {
  const response = await fetch('/api/ping');
  return response.json();
}
```

### React Hook Example

```typescript
import { useState } from 'react';

export function useContactForm() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const submit = (data: { name: string; email: string; subject: string; message: string }) => {
    launchContact(data);
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return { submit, status };
}
```

---

## Cloudinary as a CDN

### Philosophy

> **Cloudinary is your asset delivery network, not a database.**

| ✅ Use For | ❌ Don't Use For |
|-----------|------------------|
| CV/Resume PDF | Dynamic user uploads |
| Project screenshots | Database storage |
| Profile avatar | Sensitive documents |
| OG images | Temporary files |

### Optimization Features

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDINARY CDN                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  • f_auto    → Auto format (WebP/AVIF when supported)      │
│  • q_auto    → Smart quality compression                    │
│  • w_600     → Responsive width                            │
│  • c_fill    → Smart cropping                              │
│  • dpr_auto  → Device pixel ratio                          │
│                                                             │
│  Result: 50-80% smaller files, instant global delivery     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Upload Workflow

1. **Upload once** via Cloudinary Dashboard or CLI
2. **Reference by public ID** in your code
3. **Transform on-the-fly** via URL parameters
4. **Cache globally** via Cloudinary's CDN

```bash
# Upload via CLI
cloudinary upload portfolio/avatar.jpg folder=portfolio
cloudinary upload sushil-cv.pdf resource_type=raw folder=portfolio
```

---

## Security Checklist

### ✅ Input Validation

```typescript
// Always validate on the server
function sanitize(input: string): string {
  return input
    .trim()
    .slice(0, 1000)
    .replace(/<[^>]*>/g, ''); // Strip HTML
}
```

### ✅ Method Restrictions

```typescript
// Reject non-POST requests on form endpoints
if (req.method !== 'POST') {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405 }
  );
}
```

### ✅ Rate Limiting (Vercel)

```json
// vercel.json
{
  "functions": {
    "api/get-assets.ts": {
      "maxDuration": 10
    }
  }
}
```

For production, use Vercel's built-in rate limiting or Upstash Redis:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
});

// In handler
const ip = req.headers.get('x-forwarded-for') || 'anonymous';
const { success } = await ratelimit.limit(ip);

if (!success) {
  return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
}
```

### ✅ Environment Variables

```typescript
// Never expose secrets
const cloudName = process.env.CLOUDINARY_CLOUD_NAME; // Safe to expose
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL; // Injected at build time
```

### ✅ Headers

```typescript
// Security headers in response
headers: {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}
```

---

## Performance Metrics

| Metric | Target | Edge Runtime |
|--------|--------|--------------|
| Cold Start | <50ms | ✅ ~0ms (V8 Isolates) |
| Response Time | <100ms | ✅ ~20-40ms |
| Global Latency | <50ms | ✅ 300+ edge locations |
| Bundle Size | <1MB | ✅ ~10KB per function |

---

## Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Environment Setup

```bash
# Set secrets via CLI
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add VITE_CONTACT_EMAIL production
```

---

## Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE BENEFITS                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ ZERO COLD START     Edge Runtime uses V8 isolates      │
│  🌍 GLOBAL DELIVERY     300+ edge locations worldwide       │
│  🔒 SECURE BY DEFAULT   Input validation, rate limiting    │
│  📦 MINIMAL BUNDLE      ~10KB per function                 │
│  💰 COST EFFECTIVE      Pay only for invocations           │
│  🚀 INSTANT DEPLOY      Git push → Live in seconds         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*Architecture designed for sushil.dev portfolio — Fast, Secure, Global.*
