require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// Connessione DB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

// Avvio Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server GiraTrento avviato su porta ${PORT}`);
});
