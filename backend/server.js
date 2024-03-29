require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');
const { logger, logEvents } = require('./middleware/logger');
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/business', require('./routes/businessRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/pos', require('./routes/posRoutes'));
app.use('/suppliers', require('./routes/supplierRoutes'));
app.use('/suppliergoods', require('./routes/supplierGoodsRoutes'));
app.use('/businessgoods', require('./routes/businessGoodsRoutes'));
// app.use('/orders', require('./routes/orderRoutes'));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
        return;
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not found' });
        return;
    } else {
        res.type('txt').send('404 Not found');
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

mongoose.connection.on('error', (error) => {
    console.log('Mongoose connection error:', error);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');

});