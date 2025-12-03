export const config = {
  runtime: 'edge',
};

// Cloudinary unsigned upload preset name
// Create this in Cloudinary Dashboard > Settings > Upload > Upload presets
const UPLOAD_PRESET = 'portfolio_unsigned';
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'de4uhtgmb';

export default async function handler(req: Request): Promise<Response> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'portfolio/projects';

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: 'File too large. Maximum size is 10MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);
    cloudinaryFormData.append('folder', folder);

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('Cloudinary upload error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to upload to Cloudinary' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cloudinaryData = await cloudinaryResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          width: cloudinaryData.width,
          height: cloudinaryData.height,
          format: cloudinaryData.format,
          bytes: cloudinaryData.bytes,
          // Optimized URL with auto format and quality
          optimizedUrl: cloudinaryData.secure_url.replace(
            '/upload/',
            '/upload/f_auto,q_auto/'
          ),
          // Thumbnail URL
          thumbnailUrl: cloudinaryData.secure_url.replace(
            '/upload/',
            '/upload/w_400,h_300,c_fill,f_auto,q_auto/'
          ),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Upload failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
