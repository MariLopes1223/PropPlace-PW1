const express = require('express');
const { routes } = require('./routes');
import cors from 'cors'
import path from 'node:path';
require('dotenv').config()

export const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);
app.use('/uploadImovelImage', express.static(path.resolve(__dirname, '..', 'tmp', 'imovelImage')));

export const server = app.listen(3000, () => {
  console.log('Server online on port 3000');
})