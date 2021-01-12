'use strict';
const port = process.env.PORT || 3000;

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('dist'));
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Listening on ${port}.`);
});