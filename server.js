'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

//Application Setup
const server=express();
const PORT =process.env.PORT || 9000;
server.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);


//main
server.get('/', (req, res) => {
  res.send('server me ');
});
server.get('/location',locationHandler);
server.get('/weather',weatherHandler);
server.get('/parks',parkHandler);
server.get('*', statusHandler);



//location

function locationHandler(req,res){

  let city = req.query.city;
  let value=[city];
  let key = process.env.LOCATION_KEY;
  let locURL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  let SQL = `SELECT * FROM loco WHERE search_query=$1;`;
  client.query(SQL,value)
    .then(result=>{
      if (result.rows.length){
        console.log(result.rows[0]);
        res.send(result.rows[0])
          .catch(error=>{
            console.log(error);
            res.send(error);
          });
      }else {
        superagent.get(locURL)
          .then(geoData=>{
            let Data = geoData.body;
            let locationData = new Location(city,Data);
            let SQL = `INSERT INTO loco (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *;`;
            let safeValues = [locationData.search_query,locationData.formatted_query,locationData.latitude,locationData.longitude];
            client.query(SQL,safeValues);
            res.send(locationData);
          }).catch(error=>{
            console.log(error);
            res.send(error);
          });
      }
    });
}

function Location(cityName,locData){
  this.search_query = cityName;
  this.formatted_query = locData[0].display_name;
  this.latitude = locData[0].lat;
  this.longitude = locData[0].lon;
}



///weather

function weatherHandler(req,res){
  let cityName1 = req.query.search_query;
  let key1 = process.env.WEATHER_KEY;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName1}&key=${key1}&day=8`;
  superagent.get(url)
    .then(wethData=>{
      let weathArr=wethData.body.data.map(item=>
        new Weathers(item));
      res.send(weathArr);
    })
    .catch (error=>{
      console.log(error);
      res.send(error);
    });
}
function Weathers (weatherData)
{
  this.forecast = weatherData.weather.description;
  this.time = new Date(weatherData.valid_date).toString().slice(0, 15);
}



///park

function parkHandler(req,res){
  let city = req.query.search_query;
  let key2 = process.env.PARK_API_KEY;
  let parkURL = `https://developer.nps.gov/api/v1/parks?q=${city}&limit=5&api_key=${key2}`;
  superagent.get(parkURL)
    .then(parkData=>{
      let parkArr=parkData.body.data.map(item=>
        new Parks(item));
      res.send(parkArr);
    })
    .catch(error=>{
      console.log(error);
      res.send(error);
    });
}
function Parks (parkData){
  this.name = parkData.fullName;
  this.address = `${(parkData.addresses[0].line1)},${parkData.addresses[0].city},${parkData.addresses[0].stateCode} ${parkData.addresses[0].postalCode}`;
  this.fee = '0.00';
  this.description = parkData.description;
  this.url = parkData.url;
}


///status
function statusHandler(req,res){
  let errObject = {
    status: 500,
    responseText: 'Sorry, something went wrong',
  };
  res.status(500).send(errObject);
}

client.connect()
  .then(() => {
    server.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );
  });
