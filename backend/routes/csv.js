
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

function generateRandomUrl() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let url = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        url += characters[randomIndex];
    }

    return url;
}

router.post("/json", async (req, res) => {
    try {
      const {json, url, expireTime } = req.body; 
      const generatedUrl = url || generateRandomUrl();
      
    if (!json) {
      return res.status(400).json({ message: 'JSON data is required' });
    }


    const dataToInsert = {
        json_data: json,
        url: generatedUrl,
        created_at: new Date().toISOString(), // or use a library for date formatting
        expire_in: expireTime 
      };
// console.log(dataToInsert);

          // Insert data into Supabase table
    const response = await supabase
    .from('exceldata')
    .insert([dataToInsert])
    .select();

    const { data, error } = response;
    console.log('Inserted data:', data);

  if (error) {
    throw error;
  }


      res.status(200).json({ message: 'Data received and stored successfully', data }); 
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Cannot save data to database' });
    }
  });
  


  router.get('/json/:url', async (req, res) => {
      try {
          const { url } = req.params;
  
          const response = await supabase
              .from('exceldata')
              .select('json_data')
              .eq('url', url)
              .single();
  
          const { data, error  } = response;
  
          if (error) {
              if (error.code === 'PGRST116') { // Custom error code for not found
                  return res.status(404).json({ message: 'Data not found' });
              }
              console.error('Supabase error:', error);
              return res.status(500).json({ message: 'Internal server error' });
          }
  
          res.status(200).json({ json: data.json_data });
      } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });
  
  module.exports = router;
  

module.exports = router;