const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); // Adjust the path as necessary

// Function to generate a random URL
function generateRandomUrl() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let url = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        url += characters[randomIndex];
    }

    return url;
}

router.post('/saveimage', async (req, res) => {
  try {
    const { imageSrc, url } = req.body;
    const generatedUrl = url || generateRandomUrl();
    if (!imageSrc || !generatedUrl) {
      return res.status(400).json({ message: 'Image and URL are required' });
    }

    // Decode base64 image
    const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a unique filename for the image
    const filename = `${Date.now()}.png`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: 'image/png'
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL for the uploaded image
    // const { publicURL } = supabase.storage.from('images').getPublicUrl(filename);

    // Save the URL to the database
    // const { data, error } = await supabase
    //   .from('data')
    //   .insert([{  generatedUrl: generatedUrl, image_url: publicURL }]);

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: 'Image saved successfully',
      data
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
