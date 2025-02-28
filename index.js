// index.js
require('dotenv').config();
const express = require('express')
const axios = require('axios');
const cors = require('cors');


const app = express()
const PORT = 4000
const whatsappApiUrl = process.env.WHATSAPP_API_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.post('/send-data', async (req, res) => {
  try {
      const { status, data, type } = req.body;

      if (status === undefined || !data || !type) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await axios.post(`${whatsappApiUrl}/status_update`, {
          status,
          data,
          type
      }, {
          headers: {
              "Content-Type": "application/json"
          }
      });

      res.json(response.data);
  } catch (error) {
      console.error("Error sending data:", error.message);
      res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app