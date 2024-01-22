const express = require('express') 
const https = require('node:https') 
const bodyParser = require('body-parser'); 
const axios = require('axios');
 
const app = express() 
app.use(bodyParser.urlencoded({ extended: true })); 


const api = "dc7e0008c99adc1f1c05713d44e74b9e" 
 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get("./main.js", function (req, res) { 
  res.sendFile(__dirname + './main.js', { headers: { 'Content-Type': 'application/javascript' } }); 
});

app.post("/", (req, res)=>{ 
    const city = req.body.city; 
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=metric" ; 
    https.get(url, (response)=>{ 
        response.on("data", (data)=>{ 
            const weatherData = JSON.parse(data) 
            const temp = weatherData.main.temp; 
            const description = weatherData.weather[0].description; 
            const icon = weatherData.weather[0].icon; 
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"; 
            console.log(weatherData); 
            res.write("<h1>Temperature is "+ temp + "<h1>") 
            res.write("<h2>Weather is "+ description + "<h1>") 
            res.write("<img src="+ imageURL +">") 
            res.send() 
        }) 
    }) 
}); 




 
/* Nasa */
let api_key = 'HgrvCJ2vlg0EbeilvvEooyMGz18CqQxUIJce3wGX';

let header = "<a href='/earth'>Earth</a><br/>";
header += "<a href='/mars'>Mars</a><br/>";
header += "<a href='/picture-of-today'>Picture of Today</a><br/>";

app.get('/earth', (req, res) => {
  let longitude = -95.33;
  let latitude = 29.78;
  let date_of_image = '2023-01-01';
  let api_url = `https://api.nasa.gov/planetary/earth/imagery?lon=${longitude}&lat=${latitude}&date=${date_of_image}&dim=0.15&api_key=${api_key}`;
  let html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          img {
            width: 1500px;
            display: block;
            margin: 20px auto;
          }
        </style>
      </head>
      <body>
        ${header}
        <h1>Earth Image</h1>
        <img src='${api_url}' alt='Earth Image' />
      </body>
    </html>
  `;
  res.send(html);
});

app.get('/picture-of-today', (req, res) => {
  let api_url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}`;
  axios.get(api_url)
    .then((response) => {
      const data = response.data;
      let html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              h1 {
                color: #333;
                text-align: center;
              }
              img {
                height:800px;
                width:1500px;
                display: block;
                margin: 20px auto;
              }
            </style>
          </head>
          <body>
            ${header}
            <h1>Picture of Today</h1>
            <p>Date: ${data.date}</p>
            <p>Title: ${data.title}</p>
            <p>Description: ${data.explanation}</p>
            <img src='${data.hdurl}' alt='Picture of Today' />
          </body>
        </html>
      `;
      res.send(html);
    })
    .catch((err) => console.log(err));
});

app.get('/mars', (req, res) => {
  let api_url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${api_key}`;
  axios.get(api_url)
    .then((response) => {
      const data = response.data.photos;
      let html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              h1 {
                color: #333;
                text-align: center;
              }
              img {
                height:650px;
                width: 1500px;
                display: block;
                margin: 20px auto;
              }
            </style>
          </head>
          <body>
            ${header}
            <h1>Mars Photos</h1>
      `;
      data.forEach((photo) => {
        html += `
          <p>Camera: ${photo.camera.full_name}</p>
          <p>Earth date: ${photo.earth_date}</p>
          <p>Rover: ${photo.rover.name} (Landing date): ${photo.rover.landing_date}</p>
          <img src='${photo.img_src}' alt='Mars Photo' />
          <br/><br/>
        `;
      });
      html += `
          </body>
        </html>
      `;
      res.send(html);
    })
    .catch((err) => console.log(err));
});



const forexApiKey = 'rf014S9D65JbRHafpKjuHc3RZjSW1npD';

app.get('/exchange-rates', (req, res) => {
  const baseCurrency = req.query.base || 'USD';
  const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}?apikey=${forexApiKey}`;

  axios.get(apiUrl)
    .then((response) => {
      const data = response.data;
      const rates = data.rates;

      let html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              h1 {
                color: #333;
                text-align: center;
              }
              p {
                color: #666;
                text-align: center;
              }
              ul {
                list-style: none;
                padding: 0;
                margin: 0;
                text-align: center;
              }
              li {
                margin: 10px;
                padding: 10px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 5px;
                display: inline-block;
              }
            </style>
          </head>
          <body>
            <h1>Exchange Rates</h1>
            <p>Base Currency: ${baseCurrency}</p>
            <ul>
      `;

      for (const currency in rates) {
        html += `<li>${currency}: ${rates[currency]}</li>`;
      }

      html += `
            </ul>
          </body>
        </html>
      `;

      res.send(html);
    })
    .catch((err) => console.log(err));
});



app.listen(3000, ()=>{ 
    console.log("Server is running on 3000"); 
})