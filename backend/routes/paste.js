
const router = require('express').Router();
const Data = require('../models/data');

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



router.post('/paste', async (req, res) => {
    try {
        const { text, url } = req.body;
        const generatedUrl = url || generateRandomUrl();

        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }
        // Save the data to the database
        const newData = new Data({ text, url: generatedUrl });
        await newData.save();

        res.status(200).json({
             message: 'Data saved successfully',
             data: newData
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/:url', async (req, res) => {
    try {
        const { url } = req.params;
        
        const data = await Data.findOne({ url });
        
        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }
        
        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;


