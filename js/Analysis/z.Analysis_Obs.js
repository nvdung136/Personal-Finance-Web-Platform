function Chart(Chart_data) {

    
    // append the svg object to the body of the page
    var svg = d3.select("#CHARTviz")
    .append("svg")
    .attr("width", Chart_width + Chart_margin.left + Chart_margin.right)
    .attr("height", Chart_height + Chart_margin.top + Chart_margin.bottom)
    .append("g")
    .attr("transform","translate(" + Chart_margin.left + "," + Chart_margin.top + ")")
    

    var Last250Ele = Chart_data.slice(0,250);

    // Show the X scale
    var x = d3.scaleTime()
    .range([ 0, Chart_width ])
    .domain(d3.extent(Last250Ele, function(d) { return d.Date; }))
    // Configure X axis
    var xAxis = d3.axisBottom(x)
    .tickFormat(formatTime)

    var XAXIS = svg.append("g")
    .attr("transform", "translate(0," + Chart_height + ")")
    .call(xAxis).transition().duration(50)

    // Show the Y scale
    var min = d3.min(Last250Ele, function(d) { return +d.Low; });
    var max =  d3.max(Last250Ele, function(d) { return +d.High; })
    var y = d3.scaleLinear()
    .domain([min ,max])
    .range([Chart_height, 0])
    var yAxis = d3.axisLeft(y)
    var YAXIS = svg.append("g").call(yAxis).transition().duration(50)

    XAXIS.call(xAxis.scale(x).ticks(8).tickSize(-1.3*Chart_height));
    YAXIS.call(yAxis.scale(y).ticks(10).tickSize(-1.3*Chart_width));

    svg.selectAll(".tick line").attr("stroke", "#828282")
    .attr("opacity","30%")

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", Chart_width )
    .attr("height", Chart_height )
    .attr("x", 0)
    .attr("y", 0);  

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
    .scaleExtent([1,30])  // This control how much you can unzoom 
    .extent([[0, 0], [0, Chart_height]])
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
    var boxWidth = Chart_width/200
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
    .attr("stroke", "black")
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
    .attr("stroke", "black")
    .style("fill", "#FF0000")
    
    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg.append("rect")
    .attr("width", Chart_width)
    .attr("height", Chart_height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', 'translate(' + Chart_margin.left + ',' + Chart_margin.top + ')')
    .call(zoom);
    
    function updateChart() {
    
        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);
    
        // update axes with these new boundaries
        XAXIS.call(d3.axisBottom(newX))
        YAXIS.call(d3.axisLeft(newY))

        XAXIS.call(xAxis.scale(newX).ticks(8).tickSize(-1.3*Chart_height));
        YAXIS.call(yAxis.scale(newY).ticks(10).tickSize(-1.3*Chart_width));
    
        svg.selectAll(".tick line").attr("stroke", "#828282").attr("opacity","30%")
        
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