export const config = {
  runtime: 'edge',
};

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name';

/**
 * Builds optimized Cloudinary URLs with automatic transformations
 */
function cloudinaryUrl(
  publicId: string,
  options: {
    type?: 'image' | 'raw' | 'video';
    format?: string;
    width?: number;
    height?: number;
    quality?: string;
    crop?: string;
  } = {}
): string {
  const { 
    type = 'image', 
    format, 
    width, 
    height,
    quality = 'auto',
    crop,
  } = options;

  const transformations: string[] = [];

  if (type === 'image') {
    // Auto format (WebP/AVIF when supported)
    transformations.push('f_auto');
    // Auto quality optimization
    transformations.push(`q_${quality}`);
    // Width
    if (width) transformations.push(`w_${width}`);
    // Height
    if (height) transformations.push(`h_${height}`);
    // Crop mode
    if (crop) transformations.push(`c_${crop}`);
  }

  const transform = transformations.length > 0 
    ? `/${transformations.join(',')}` 
    : '';

  const resourceType = type === 'raw' ? 'raw' : type === 'video' ? 'video' : 'image';
  const extension = format ? `.${format}` : '';

  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload${transform}/v1/${publicId}${extension}`;
}

export default function handler(): Response {
  const assets = {
    // Profile & Branding
    avatar: {
      thumbnail: cloudinaryUrl('portfolio/avatar', { width: 80, height: 80, crop: 'fill' }),
      small: cloudinaryUrl('portfolio/avatar', { width: 150, height: 150, crop: 'fill' }),
      medium: cloudinaryUrl('portfolio/avatar', { width: 300, height: 300, crop: 'fill' }),
      large: cloudinaryUrl('portfolio/avatar', { width: 600, height: 600, crop: 'fill' }),
    },

    // Documents (Raw files - no transformations)
    documents: {
      cv: {
        url: cloudinaryUrl('portfolio/documents/sushil-resume', { type: 'raw', format: 'pdf' }),
        filename: 'Sushil_Developer_Resume.pdf',
      },
    },

    // Project Assets
    projects: {
      pixelQuest: {
        id: 'pixel-quest',
        thumbnail: cloudinaryUrl('portfolio/projects/pixel-quest/thumbnail', { width: 600, height: 400, crop: 'fill' }),
        hero: cloudinaryUrl('portfolio/projects/pixel-quest/hero', { width: 1400, height: 800, crop: 'fill' }),
        screenshots: [
          cloudinaryUrl('portfolio/projects/pixel-quest/screenshot-1', { width: 1200 }),
          cloudinaryUrl('portfolio/projects/pixel-quest/screenshot-2', { width: 1200 }),
          cloudinaryUrl('portfolio/projects/pixel-quest/screenshot-3', { width: 1200 }),
        ],
      },
      neonGrid: {
        id: 'neon-grid',
        thumbnail: cloudinaryUrl('portfolio/projects/neon-grid/thumbnail', { width: 600, height: 400, crop: 'fill' }),
        hero: cloudinaryUrl('portfolio/projects/neon-grid/hero', { width: 1400, height: 800, crop: 'fill' }),
        screenshots: [
          cloudinaryUrl('portfolio/projects/neon-grid/screenshot-1', { width: 1200 }),
          cloudinaryUrl('portfolio/projects/neon-grid/screenshot-2', { width: 1200 }),
        ],
      },
      dataVault: {
        id: 'data-vault',
        thumbnail: cloudinaryUrl('portfolio/projects/data-vault/thumbnail', { width: 600, height: 400, crop: 'fill' }),
        hero: cloudinaryUrl('portfolio/projects/data-vault/hero', { width: 1400, height: 800, crop: 'fill' }),
        screenshots: [
          cloudinaryUrl('portfolio/projects/data-vault/screenshot-1', { width: 1200 }),
        ],
      },
    },

    // Social & Meta
    social: {
      ogImage: cloudinaryUrl('portfolio/meta/og-image', { width: 1200, height: 630, crop: 'fill' }),
      twitterCard: cloudinaryUrl('portfolio/meta/twitter-card', { width: 1200, height: 600, crop: 'fill' }),
    },

    // Misc Assets
    misc: {
      logo: cloudinaryUrl('portfolio/branding/logo', { width: 200 }),
      favicon: cloudinaryUrl('portfolio/branding/favicon', { width: 32, height: 32, crop: 'fill' }),
    },

    // CDN Info
    _meta: {
      cloudName: CLOUD_NAME,
      baseUrl: `https://res.cloudinary.com/${CLOUD_NAME}`,
      generatedAt: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(assets, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Cache for 1 hour, allow stale while revalidating for 24 hours
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
