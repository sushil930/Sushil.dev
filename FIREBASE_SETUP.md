# Firebase Setup Guide

This project uses Firebase Firestore to store project data, skills, and rating information (excluding images).

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., `sushil-portfolio`)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set up rules next)
4. Select your preferred location (e.g., `us-central`)
5. Click **"Enable"**

### 3. Configure Firestore Security Rules

1. Go to **"Firestore Database"** > **"Rules"** tab
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents
    match /{document=**} {
      allow read: if true;
    }
    
    // Only allow writes from authenticated sources or specific conditions
    match /projects/{projectId} {
      allow write: if true; // Change this based on your auth requirements
    }
    
    match /skills/{skillId} {
      allow write: if true; // Change this based on your auth requirements
    }
    
    match /ratings/{ratingId} {
      allow read: if true;
      allow write: if true; // Anyone can submit ratings
    }
  }
}
```

3. Click **"Publish"**

> **Security Note**: The above rules allow public write access. For production, implement Firebase Authentication and restrict writes to authenticated admin users.

### 4. Get Your Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** `</>` to add a web app
5. Register your app with a nickname (e.g., `portfolio-web`)
6. Copy the `firebaseConfig` object

### 5. Configure Environment Variables

1. In your project root, create a `.env` file (or `.env.local`)
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Replace the placeholder values with your actual Firebase config values

### 6. Initialize Firestore Collections

The app will automatically create the following collections when you add data:

- **`projects`** - Stores project metadata (excluding images)
- **`skills`** - Stores skill information
- **`ratings`** - Stores portfolio rating data
- **`config`** - Stores admin configuration (password)

### 7. Setting Admin Password

To store your admin password in the database:

1. Go to **Firestore Database** in Firebase Console
2. Click **"Start collection"**
3. Collection ID: `config`
4. Document ID: `admin`
5. Field: `password` (string) -> Enter your desired password
6. Click **Save**

> **Note**: If this document doesn't exist, the app will fallback to the `VITE_ADMIN_PASSWORD` environment variable, and then to the default `admin123`.

### 8. Data Structure

#### Projects Collection

Each document in the `projects` collection has the following structure:

```typescript
{
  id: number,
  title: string,
  description: string,
  longDescription?: string,
  features?: string[],
  challenges?: string,
  tech: string[],
  status?: 'Completed' | 'In Progress' | 'Maintenance',
  liveLink: string,
  codeLink: string,
  updatedAt: Timestamp
}
```

> **Note**: `image` and `screenshots` are stored in localStorage and Cloudinary, not in Firebase.

#### Skills Collection

```typescript
{
  name: string,
  level: number,
  category: string,
  icon: string,
  color: string,
  barColor: string,
  updatedAt: Timestamp
}
```

#### Ratings Collection

Document ID: `portfolio_ratings`

```typescript
{
  totalRatings: number,
  sumOfRatings: number,
  lastUpdated: Timestamp
}
```

### 8. Testing

1. Run your development server: `npm run dev`
2. Open the admin dashboard: `http://localhost:3000/admin`
3. Add a project or skill
4. Check Firebase Console > Firestore Database to see the new documents

### 9. Production Deployment

For production:

1. **Set up Firebase Authentication** (recommended)
2. **Update Firestore rules** to restrict writes to authenticated admins
3. **Add environment variables** to your hosting platform (Vercel, Netlify, etc.)
4. **Test thoroughly** before going live

## Hybrid Storage Strategy

This portfolio uses a hybrid storage approach:

- **Firebase Firestore**: Stores all project/skill metadata and ratings
- **Cloudinary**: Stores project images and screenshots
- **localStorage**: Acts as a client-side cache for faster loading

### Benefits

- **Images stay on Cloudinary**: Optimized delivery via CDN
- **Structured data in Firebase**: Real-time sync, scalability
- **Offline support**: localStorage cache works without network
- **Cost-effective**: Free Firebase tier handles moderate traffic

## Troubleshooting

### "Permission denied" errors

- Check your Firestore security rules
- Ensure you're using the correct project configuration

### Data not syncing

- Verify your `.env` file has correct Firebase credentials
- Check browser console for Firebase errors
- Ensure Firestore is enabled in Firebase Console

### Rating not updating

- Clear localStorage: `localStorage.clear()`
- Check Firebase Console > Firestore > `ratings/portfolio_ratings`

## Support

For issues or questions, refer to:
- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
