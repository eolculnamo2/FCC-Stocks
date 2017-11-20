var socket = io.connect()
var dataset = [];
//DOM elements
var btn = document.getElementById("loader")
var chart = document.getElementById("chart");
//d3 graph function

function createGraph(){
  chart.innerHTML = "";
  var merged = [].concat.apply([], dataset);
var h = 400;
var w = 800;
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
var line = canvas.selectAll("lines")
    .data(a)
    .enter()
    .append("line")
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
          return scaleY(d[1])
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
  .attr("transform", "translate(0,460)")  
.call(xAxis);

const yAxis = d3.axisLeft(scaleY)
canvas.append("g")
.attr("transform", "translate(50,0)")
.call(yAxis)
  
}
//^End graph function

//event listeners
btn.addEventListener('click',()=>{
  socket.emit('load')
})


//requests from server
socket.on('load', (data)=>{
  dataset = data;
  createGraph();
})

