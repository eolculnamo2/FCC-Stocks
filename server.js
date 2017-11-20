
var express = require('express');
var socket = require('socket.io');
var Quandl = require('quandl')

//express =>
var app = express();
app.use(express.static('public'));


//app.listen and socket.io
var server = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + server.address().port);
});
var io = socket(server)

//Companies array= collection of companies from socket.on("load")
var companies =["FB","COP"];
//after companies is looped, companiesdata is sent to dataviz.j
var companiesData = [];

//start io connection
io.on("connection", (socket)=>{
  companiesData=[];
  console.log("Connected")
  
  socket.on('load', ()=>{
    
//quandl is nested in callback function and socket emits in success function for api request
var quandl = new Quandl({
    auth_token: process.env.quandlKey,
    api_version: 3,
   // proxy: "http://myproxy:3128"
});
companies.forEach((x)=>{
quandl.dataset({
  source: "WIKI",
  table: x
}, {
  order: "asc",
  exclude_column_names: true,
  // Notice the YYYY-MM-DD format 
  start_date: "2015-01-30",
  end_date: "2016-01-29",
  column_index: 4
}, function(err, response){
    if(err)
        throw err;
    var alpha = JSON.parse(response)
   companiesData.push(alpha.dataset.data)
  console.log(companiesData)

io.sockets.emit("load", companiesData)
                        
   
  //console.log(alpha.dataset.data)
 
});
 })
  })
})



app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


