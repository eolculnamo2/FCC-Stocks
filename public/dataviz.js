var socket = io.connect()
var dataset = [];
var cityData = [];
//DOM elements
var btn = document.getElementById("loader")
var chart = document.getElementById("chart");
var textTool = document.getElementById("textTool");
var search = document.getElementById("sym").value

//d3 graph function
function createGraph(){
  
  chart.innerHTML = "";
  var merged = [].concat.apply([], dataset);
var h = 400;
var w = window.innerWidth*.9;//800
var padding = 50;

// x axis is time, y axis is value

  //alert("A: "+a)
var scaleY = d3.scaleLinear()
  .domain(
    [d3.min(merged,(d)=> d[1]),
    d3.max(merged, (d)=> d[1])]
  )
  .range(
    [h-padding, padding]
  );

  var scaleX = d3.scaleLinear()
    .domain([0, merged.length/dataset.length])
    .range([padding, w+padding]);
var canvas = d3.select("#chart")
    .append('svg')
    .attr("width",w)
    .attr("height",h)

dataset.forEach((a,p)=>{
  
var tooltips = canvas.selectAll("rect")
    .data(a)
    .enter()
    .append("rect")
    .attr("class", "tooltip")
    .attr("x", (d,i)=> scaleX(i))
    .attr("y", (d,i)=> padding)
    .attr("width", (d,i)=> scaleX(i))
    .attr("height", ()=>h-padding*2)
    .append("title")
    .text((d,i)=>{
      var arr = [];
      dataset.forEach((x,y)=>{
        arr.push(cityData[y]+": "+x[i][1])
      })
      var arrS = arr.toString();
      
      return "Date: "+d[0]+"\n"+ arrS.replace(/,/g,"\n")
    })

    
var line = canvas.selectAll("lines")
    .data(a)
    .enter()
    .append("line")
    .attr("class","point")
    .attr("x1",(d,i)=>{
      if(i>0){
      return scaleX(i-1);
      }
      else{
        return scaleX(0)
      }
    })
    .attr("y1", (d,i)=>{
      if(i>0){
        return scaleY(a[i-1][1])
      }
        else{
          return null
        }
    })
    .attr("x2", (d,i)=>{
     return scaleX(i);
    })
    .attr("y2",(d,i)=>  i>0 ?  scaleY(d[1]) :  scaleY(a[0]))
    .attr("stroke", "gray")
    .attr("stroke-width", "3px")
    .append("title")
    .text((d)=>"Date: "+d[0]+"Value: "+d[1])
})

   const xAxis = d3.axisBottom(scaleX)
   canvas.append("g")
  .attr("transform", "translate(0,"+(h-padding)+")")  
.call(xAxis
     .ticks(0)
     .tickFormat(""));

const yAxis = d3.axisLeft(scaleY)
canvas.append("g")
.attr("transform", "translate("+padding+",0)")
.call(yAxis)
  
  
  
  }
//^End graph function

//event listeners
btn.addEventListener('click',()=>{
  socket.emit('search', document.getElementById("sym").value)
  socket.emit('load')
  
})


//requests from server
socket.on('fullData', (data)=>{
  cityData.push(data)
})
socket.on('load', (data)=>{
  dataset = data;
  createGraph();
  
})

