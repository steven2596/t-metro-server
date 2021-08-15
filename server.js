const express = require('express');
const path = require('path');
const cors = require('cors');


// This will look for .env file in root folder and add it to process environment
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

//Server will run on port 5000, Put proxy: "http://locahost:5000" in client package.json
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/build')));

//     app.get('*', function (req, res) {
//         res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
//     })
// }

app.listen(port, error => {
    if (error) throw error;
    console.log('Server running on port' + port);
});

app.get('/', (req, res) => {
    res.send('server running now');
})


//This will handle post request from front-end.
// req will contain information which is filled by customer including amount, credit card info, etc
app.post('/payment', (req, res) => {
    const body = {
        source: req.body.token.id,
        amount: req.body.amount,
        currency: 'usd'
    };


    //If API call fails, we will send back error. Otherwise, we will send back success msg
    stripe.charges.create(body, (stripeError, stripeRes) => {
        if (stripeError) {
            res.status(500).send({ error: stripeError });
        } else {
            res.status(200).send({ success: stripeRes })
        }
    });
});