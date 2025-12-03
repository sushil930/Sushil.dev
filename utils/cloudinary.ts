
export const uploadImageToCloudinary = async (file: File, folder: string = 'portfolio/projects') => {
  const CLOUD_NAME = 'de4uhtgmb'; 
  const UPLOAD_PRESET = 'portfolio_unsigned';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload error: ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        optimizedUrl: data.secure_url.replace(
          '/upload/',
          '/upload/f_auto,q_auto/'
        ),
        thumbnailUrl: data.secure_url.replace(
          '/upload/',
          '/upload/w_400,h_300,c_fill,f_auto,q_auto/'
        ),
      },
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
};
