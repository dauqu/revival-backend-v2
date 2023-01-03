const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');



// exress app 
const app = express();

//env
require('dotenv').config();

//mongo db
require('./config/connection');

// port 
const port = process.env.PORT || 4000;

// cors
const allowedOrigins = ["http://localhost:3000", "https://revival-frontend.vercel.app", "https://revival-frontend-ru4m.vercel.app"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

// use json and cookie parser 
app.use(express.json());
app.use(cookieParser());

// static file 
app.use(express.static(__dirname+'/medias/'))

//test
app.get('/', (req, res) => {
    res.send('Hello World!');
})

// routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/register', require('./routes/register'));
app.use('/api/beneficiary', require('./routes/beneficiary'));
app.use('/api/bank', require('./routes/bank'));
app.use('/api/upload', require('./routes/uploadDoc'));

app.use('/api/payment', require('./routes/payments'));

app.use('/api/stream', require('./routes/stream'));

app.use('/api/profile', require('./routes/profile'));
app.use('/api/user', require('./routes/user'));





// listen app 
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`)
})
