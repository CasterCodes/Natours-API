import dotenv from 'dotenv';
import connection from './config/Database.js';
dotenv.config({});

import app from './app.js';

connection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on  port ${PORT}`));