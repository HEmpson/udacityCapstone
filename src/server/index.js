const dotenv = require('dotenv');
dotenv.config();
var path = require('path')

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'))


app.get('/', function (req, res) {
    res.sendFile(path.resolve('src/client/views/index.html'))
})


// post route for geoNames
app.post('/getGeoNames', getGeoNamesDetails = async (req, res) => {
    
    try {
        let destination = req.body.destination;
        let username = process.env.GEONAMES_USERNAME;
        const URL = `http://api.geonames.org/searchJSON?q=${destination}&maxRows=1&username=${username}`
        const geoNameRes = await callAPI(URL);
        res.send(geoNameRes);
    } catch (error) {
        res.send(error);
    }
})


// post route for weather api
app.post('/getWeather', getWeather = async (req, res) => {

    try {
        const lng = req.body.data.geonames[0].lng;
        const lat = req.body.data.geonames[0].lat;
        const daysToGo = req.body.forecast;
        const API_KEY = process.env.WEATHERBIT_API_KEY;

        // use forecast API
        if (daysToGo > 7) {
            let path = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${API_KEY}`
            const APIres = await callAPI(path);
            res.send(APIres);
        }
        // otherwise use other api
        else {
            let path = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${API_KEY}`
            const APIres = await callAPI(path);
            res.send(APIres);
        }
    } catch (error) {
        res.send(error);
    }
    
})

// post route for pixabay
app.post('/getPhoto', getPhoto = async (req, res) => {

    try {
        const API_KEY = process.env.PIXA_API_KEY;
        const destination = req.body.destination;
        let path = `https://pixabay.com/api/?key=${API_KEY}&q=${destination}`

        const APIres = await callAPI(path);
        res.send(APIres);
    } catch (error) {
        res.send(error);
    }
    
})



// call the APIa
const callAPI = async (url) => {
    const res = await fetch(url);
    try {
        const data = await res.json();
        return data;

    } catch (error) {
        console.log('error', error);
    }
}

module.exports = app

