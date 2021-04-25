'use strict';
const express= require('express');
const server=express();
const PORT =process.env.PORT || 1964;

const cors = require('cors');
server.use(cors());

server.get('/', (req, res) => {
  res.send('server me ');
});

server.get('/location',(req,res)=>{
  const locdata=require('./data/location.json');
  let locObject= new Location(locdata);
  res.send(locObject);
});

let weatherArr=[];
server.get('/weather',(req,res)=>{
  const weatherData=require('./data/weather.json');

  weatherData.data.forEach(element => {
    let date =element.valid_date;
    let description=element.weather.description;
    let weather=new Weather(description,date);
    weatherArr.push(weather);
  });
  res.send(weatherArr);
});


function Location(locationData) {
  this.search_query = 'Lynwood';
  this.formatted_query = locationData[0].display_name;
  this.latitude = locationData[0].lat;
  this.longitude = locationData[0].lon;
}

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}


server.get('*', (req, res) => {
  let errObject = {
    status: 500,
    responseText: 'Sorry, something went wrong',
  };
  res.status(500).send(errObject);
});


server.listen(PORT,()=>{
  console.log(`listening on port ${PORT}`);
});

