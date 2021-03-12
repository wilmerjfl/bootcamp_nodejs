const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
// Load enviroment variables
dotenv.config();

// Load Config
const {connectDB} = require('./config/db');
const PORT = process.env.PORT || 3000;

// Import Middleware
const errorHandler = require('./middleware/error');
// Import Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const fileUpload = require('express-fileupload');
const authentication = require('./routes/auth');
const rateLimit = require('express-rate-limit');

// Connect to database
connectDB();

// Running App
const app = express();

// Dev Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(
      morgan(':method :url :status :response-time ms - :res[content-length]'));
}
// Cookie Parser
app.use(cookieParser());
// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(express.json());

// Mongo Sanitize
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent xss attack
app.use(xssClean());

// Rate Limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);
// Prevente http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// Use Routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', authentication);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Use Middlewares
app.use(errorHandler);

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
            .yellow.bold));
