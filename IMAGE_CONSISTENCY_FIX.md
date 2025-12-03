# Image Consistency & Deployment Fix

## 1. Issue Analysis
The "disappearing image" and "device inconsistency" issues were caused by a logic error in the data synchronization layer (`utils/dataManager.ts` and `utils/firebaseService.ts`).

- **The Bug:** The application was explicitly **stripping** image URLs before saving to Firebase, and attempting to merge them back from the device's local storage (`localStorage`) upon fetching.
- **The Consequence:** 
    - **Desktop:** Had the image in `localStorage`, so it displayed correctly.
    - **Mobile:** Did not have the image in `localStorage` (or had an old version), so it displayed nothing or an old image.
    - **Clear Cache:** Clearing site data wiped `localStorage`, permanently deleting the image reference because it was never saved to the backend.

## 2. Fixes Applied
I have patched the following files to ensure the **Cloudinary URL** is treated as the single source of truth and stored persistently in Firebase.

### `utils/firebaseService.ts`
- **Removed:** The code that destructured and excluded `image` and `screenshots` fields.
- **Added:** Logic to save the full project object, including the Cloudinary URLs.

### `utils/dataManager.ts`
- **Removed:** The "merge" logic that overwrote Firebase data with local storage data.
- **Updated:** The application now trusts Firebase as the primary data source. `localStorage` is used only as a fallback/cache, not an override.

## 3. Steps to Restore Consistency (Critical)
Since the database (Firebase) currently holds project records *without* images (due to the previous bug), you must perform a **one-time sync** from the device that has the correct data (likely your Desktop).

1.  **Open the Admin Dashboard** on your **Desktop** (where images are currently visible).
2.  **Edit** each project that has a missing/broken image.
3.  **Re-upload** the image (or just click "Save" if the image preview is visible and correct).
    - *Note: Clicking "Save" will now push the full object, including the image URL, to Firebase.*
4.  **Verify on Mobile:**
    - Open the site on your mobile device.
    - Refresh the page. The images should now appear and persist even after clearing cache.

## 4. Production-Safe Image Implementation
Ensure all image tags in your components use the following pattern to prevent layout shifts and ensure proper loading.

**Example (`components/Projects.tsx`):**

```tsx
<img 
  src={project.image} 
  alt={project.title}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover transition-opacity duration-500 opacity-0 data-[loaded=true]:opacity-100"
  onLoad={(e) => e.currentTarget.setAttribute('data-loaded', 'true')}
  onError={(e) => {
    e.currentTarget.src = 'https://res.cloudinary.com/de4uhtgmb/image/upload/v1/portfolio/placeholder.png'; // Fallback
    e.currentTarget.setAttribute('data-loaded', 'true');
  }}
/>
```

## 5. Deployment Instructions

To deploy these fixes and ensure stability:

1.  **Commit the changes:**
    ```bash
    git add .
    git commit -m "fix: persist image URLs to firebase and remove local storage dependency"
    git push origin main
    ```

2.  **Trigger a new build** (if not automatic) on Vercel/Netlify.

3.  **Clear Build Cache (Optional but Recommended):**
    - If using Vercel: Go to **Settings > Data Cache > Purge Everything**.
    - This ensures no stale build artifacts are served.

4.  **Verification:**
    - After deployment, open the live site on a **Incognito/Private** window (simulating a new device).
    - Verify images load correctly.
