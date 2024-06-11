// Separation of your concerns
// CRUD => Create / Read / Update / Delete
// Paginashion
// ====================================================
const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');

const dbConnection = require('./config/database');


const mountRoutes = require('./routes/index');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorHandlingMiddleWare');
//=======================================================

dotenv.config({path: '.env'});
//------------------------------
// Express App
const app = express();

// enable other domain to access the api
app.use(cors());
app.options('*', cors());


//compression
app.use(compression());



//------------------------------

// Database Configuration
dbConnection();
//------------------------------

// Parsing the encoded String of postman data to a JavaScript JSON
app.use(express.json());
//------------------------------
// app.use(express.static(path.join(__dirname, 'uploads')));
//------------------------------

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
};
//------------------------------

// Mount Routes
mountRoutes(app);
//------------------------------

// Wrong route error handler
app.all('*', (req, res, next) => {
    // Create Error and send it to the Global error handling middleware
    next(new ApiError(`Can not find this route path: ${req.originalUrl}`, 400));
});

//------------------------------

// Global error handling middleware
app.use(globalError);

//------------------------------

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('App running successfully');
});
//------------------------------


// Handling rejections outside express Global error handler

process.on('unhandledRejection', (error) => {
    
    console.error(`UnandledRejection: ${error.name} | ${error.message}`);
    server.close(() => {
        console.error(`Shutting down server....`);
        process.exit(1);
    });
});

    