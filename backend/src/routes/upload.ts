import { Hono } from 'hono';
import { adminMiddleware } from '../middleware/auth.js';
import cloudinary from '../lib/cloudinary.js';

const uploadApp = new Hono();

uploadApp.use('/*', adminMiddleware);

uploadApp.post('/', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || typeof file === 'string') {
      return c.json({ success: false, error: 'No valid file uploaded' }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'jonel_clothing',
    });

    return c.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ success: false, error: 'Failed to upload image' }, 500);
  }
});

export default uploadApp;
