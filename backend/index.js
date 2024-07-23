const express = require('express')
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
// const supabase = require('./supabaseClient')

// Load environment variables
dotenv.config();
app.use(cors())


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use('/api/v1', require('./routes/paste'))
app.use('/api/v1', require('./routes/imagehandling'))
app.use('/api/v1', require('./routes/csv'))

app.listen(4000, async ()=>{
    // await connectDB();
    console.log('server is running on 4000 port');
})
