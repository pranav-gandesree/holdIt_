
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

        if (!imageSrc) {
            return res.status(400).json({ message: 'Image source is required' });
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
            console.error('Upload error:', uploadError);
            return res.status(500).json({ message: 'Error uploading image' });
        }
        

        // Get public URL for the uploaded image
        const { data: publicUrlData, error: publicUrlError } = supabase.storage
            .from('images')
            .getPublicUrl(filename);

        // Log the entire response for debugging
        console.log('Public URL data:', publicUrlData);
        console.log('Public URL error:', publicUrlError);

        if (publicUrlError) {
            console.error('Error getting public URL:', publicUrlError);
            return res.status(500).json({ message: 'Error getting public URL' });
        }

        // Ensure publicURL is not null or undefined
        const publicURL = publicUrlData?.publicUrl;
        if (!publicURL) {
            console.error('Public URL is undefined');
            return res.status(500).json({ message: 'Error retrieving public URL' });
        }

        // Save the URL to the database
        const { data, error: insertError } = await supabase
            .from('data')
            .insert([{ text: publicURL, url: generatedUrl }]);

        if (insertError) {
            console.error('Insert error:', insertError);
            return res.status(500).json({ message: 'Error saving data to database' });
        }

        res.status(200).json({
            message: 'Image saved successfully',
            generatedUrl
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




router.get('/:url', async (req, res) => {
    try {
        const { url } = req.params;

        const response = await supabase
            .from('data')
            .select('text')
            .eq('url', url)
            .single();

        console.log('Supabase response:', response);

        const { data, error } = response;

        if (error) {
            if (error.code === 'PGRST116') { // Custom error code for not found
                return res.status(404).json({ message: 'Data not found' });
            }
            console.error('Supabase error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
