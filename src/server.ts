const express = require('express');
const { routes } = require('./routes');
import cors from 'cors'
import path from 'node:path';
const API_PORT = process.env.API_PORT
require('dotenv').config()

export const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);
app.use('/images', express.static(path.resolve(__dirname, '..', 'tmp', 'imovelImage')));

export const server = app.listen(API_PORT, () => {
  console.log(`Server online on port ${API_PORT}`);
})