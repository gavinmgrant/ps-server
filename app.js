const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('common')); 
app.use(cors());

const playstore = require('./playstore-data.js');

app.get('/apps', (req, res) => {
    const { sort, genres = "" } = req.query;

    // validate rating, app, or nothing else for sort query
    if (sort) {
        if (!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be rating or app');
        }
    }

    // validate a correct selection is made for the genres query
    if (genres) {
        if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
            .includes(genres)) {
            return res
                .status(400)
                .send('Select a valid genre: Action, Puzzle, Strategy, Causl, Arcade, or Card');
            }
    }

    let results = playstore
        .filter(play => 
            play
                .Genres
                .toLowerCase()
                .includes(genres.toLowerCase()));

    // sort apps
    if (sort === 'rating') {
        results.sort((a, b) => {
            return b.Rating - a.Rating;
        });
    }

    if (sort === 'app') {
        results.sort((a, b) => {
            return a.App > b.App ? 1 : -1;
        });
    }

    res.json(results);

});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});