
// Dependencies
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require('cors');

// Express app initialization
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: 'H&HcOrP2023!', 
  resave: false,
  saveUninitialized: false,
  rolling: true, // <-- Ajouter cette ligne
  cookie: {
    secure: false, 
    httpOnly: true, 
    maxAge: 60 * 60 * 1000 // 1 heure en millisecondes
  }
}));


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors({
  origin: process.env.CLIENT_URL,
})); 

const db = mongoose.connection;

db.on('error', () => console.log('Error in connecting to database'));
db.once('open', () => console.log('Connected to Database'));

// Import routes and configuration
const authRoutes = require('./routes/auth')(db);
const productRoutes = require('./routes/product')(db);


app.get("/", (req, res) => {
return res.redirect("index.html");
});

app.get('/access_denied', function (req, res) {
res.sendFile(path.join(__dirname, 'public', 'access_denied.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(process.env.PORT, () => {
  console.log('Backend server is running !!!');
});
