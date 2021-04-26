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
server.get('/weather', weatherHandler);

function weatherHandler(req,res){
  let getData = require('./data/weather.json');
  let newArr=[];
  getData.data.forEach(element => {
    let WeathersData = new Weather(element);
    newArr.push(WeathersData);

  });
  res.send(newArr);
}

function Location(locationData) {
  this.search_query = 'Lynwood';
  this.formatted_query = locationData[0].display_name;
  this.latitude = locationData[0].lat;
  this.longitude = locationData[0].lon;
}

function Weather (weatherData)
{
  this.forecast = weatherData.weather.description;
  this.time = new Date(weatherData.valid_date).toString().slice(0, 15);
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

