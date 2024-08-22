// * OPERATION
const SrvDmn = (window.location.hostname != '') ? `http://${window.location.hostname}` : 'http://localhost'; 
const portNO = 3000;
var Chart_ObjData=[];
const formatTime = d3.utcFormat("%d-%b");

var ChartArea = document.querySelector('#my_dataviz')

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 800 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Read the data
async function TCK_Fetch() {
    var TCK_name = 'hpg'
    if(TCK_name=='') {
        alert('NO INPUT');
        return;
    }
    let option = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    let URL = `${SrvDmn}:${portNO}/TCK_fetch/${TCK_name}`;
    let _Fetching = await fetch(URL, option).catch(() => {alert("Failed to load data"); return});
    let obj_Data = await _Fetching.json();
    switch(obj_Data.status) {
        case 200:{   
            Chart_ObjData = []
            obj_Data.data.forEach(element => {
                object = {
                    Date: new d3.utcParse("%d/%m/%Y")(element.Date),
                    Open: +element.Opn,
                    High: +element.Hgh,
                    Low: +element.Low,
                    Close: +element.Cls,
                    Volume: +element.Vol, // convert "Length" column to number
                }
                Chart_ObjData.push(object)
            });
            console.log(Chart_ObjData)
            break;
        };
        case 300:
        {
        alert('No data connection - reload page')
        break;
        }
    }
    }

function Chart(Chart_data) {
    // Show the X scale
    var x = d3.scaleTime()
    .range([ 0, width ])
    .domain(d3.extent(Chart_data, function(d) { return d.Date; }))
    // Configure X axis
    var xAxis = d3.axisBottom(x)
    .tickFormat(formatTime)
    .ticks(8)
    var XAXIS = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    
    // Show the Y scale
    var min = d3.min(Chart_data, function(d) { return +d.Low; });
    var max =  d3.max(Chart_data, function(d) { return +d.High; })
    var y = d3.scaleLinear()
    .domain([min ,max])
    .range([height, 0])
    var yAxis = d3.axisLeft(y)
    .ticks(10)
    var YAXIS = svg.append("g").call(yAxis)
    
    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width )
    .attr("height", height )
    .attr("x", 0)
    .attr("y", 0);
            
    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
    .scaleExtent([.5,3])  // This control how much you can unzoom 
    .extent([[0, 0], [width, height]])
    .on("zoom", updateChart);
    
    var vertLines = svg.append('g')
    .attr("clip-path", "url(#clip)")
    // Show the main vertical line
    vertLines
    .selectAll("vertLines")
    .data(Chart_data)
    .enter()
    .append("line")
        .attr("x1", function(d){return(x(d.Date))})
        .attr("x2", function(d){return(x(d.Date))})
        .attr("y1", function(d){return(y(d.High))})
        .attr("y2", function(d){return(y(d.Low))})
        .attr("stroke", "black")
        .style("width", 0.5)
    // rectangle for the main box
    var boxWidth = 3
    var Incr = []
    var Decr = []
    Chart_data.forEach(element => {
        if(element.Close > element.Open){Incr.push(element)}
        else {Decr.push(element)}
    });
    
    var greenBoxes = svg.append('g')
    .attr("clip-path", "url(#clip)")

    greenBoxes
    .selectAll("Gboxes")
    .data(Incr)
    .enter()
    .append("rect")
    .attr("x", function(d){return(x(d.Date)-boxWidth/2)})
    .attr("y", function(d){return y(d.Close);})
    .attr("height", function(d){return (y(d.Open) - y(d.Close))})
    .attr("width", boxWidth )
    .attr("stroke", "green")
    .style("fill", "#69b3a2")

    var redBoxes = svg.append('g')
    .attr("clip-path", "url(#clip)")
            
    redBoxes
    .selectAll("Rboxes")
    .data(Decr)
    .enter()
    .append("rect")
    .attr("x", function(d){return(x(d.Date)-boxWidth/2)})
    .attr("y", function(d){return y(d.Open);})
    .attr("height", function(d){return (y(d.Close) - y(d.Open))})
    .attr("width", boxWidth )
    .attr("stroke", "red")
    .style("fill", "#FF0000")
    
    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(zoom);
    
    function updateChart() {

        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);
        var ratio = newX/x
        console.log(ratio)    

        // update axes with these new boundaries
        XAXIS.call(d3.axisBottom(newX))
        YAXIS.call(d3.axisLeft(newY))
        
        // update vertical lines position
        vertLines
        .selectAll("line")
        .attr("x1", function(d){return(newX(d.Date))})
        .attr("x2", function(d){return(newX(d.Date))})
        .attr("y1", function(d){return(newY(d.High))})
        .attr("y2", function(d){return(newY(d.Low))})
    
        redBoxes
        .selectAll("rect")
        .attr("x", function(d){return(newX(d.Date)- boxWidth/2)})
        .attr("y", function(d){return newY(d.Open);})
        .attr("height", function(d){return (newY(d.Close) - newY(d.Open))})
        greenBoxes
        .selectAll("rect")
        .attr("x", function(d){return (newX(d.Date)-boxWidth/2)})
        .attr("y", function(d){return newY(d.Close);})
        .attr("height", function(d){return (newY(d.Open) - newY(d.Close))})
    }
}

