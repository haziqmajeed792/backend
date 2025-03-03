// index.js
require('dotenv').config();
const express = require('express')
const axios = require('axios');
const cors = require('cors');


const app = express()
const PORT = 4000
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const IDENTITY_API_BASE_URL = process.env.IDENTITY_API_BASE_URL;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.post('/status_update', async (req, res) => {
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



app.post('/authenticateFacial', async (req, res) => {
  try {
      const response = await axios.post(
          `${IDENTITY_API_BASE_URL}/services/authenticateFacial`,
          {
              token1: req.body.token1,
              token2: req.body.token2,
              method: req.body.method,
              tracking: req.body.tracking
          },
          {
              headers: {
                  'x-api-key': API_KEY,
                  'Content-Type': 'application/json'
              }
          }
      );
      res.json(response.data);
  } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = app