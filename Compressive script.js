var slider = $("#myRange").val();
var xtwo;
var xone;
var xzero;
var firstx = -1;
var firsty = 1;
var secondx = 2;
var secondy = 4;
var thirdx = 4;
var thirdy = 5;
var lineData = [];
var nodes = [];
var data = [];
var bigX;
var smallX;
var xRange = 1;
var yRange = 1;
var originx1 = firstx;
var originy1 = firsty;
var originx2 = secondx;
var originy2 = secondy;
var originx3 = thirdx;
var originy3 = thirdy;

//updates coefficients
function updateXs() {

    var pixelx1 = xRange(originx1) + nodes[0].x;
    var pixely1 = yRange(originy1) + nodes[0].y;
    var pixelx2 = xRange(originx2) + nodes[1].x;
    var pixely2 = yRange(originy2) + nodes[1].y;


    //update vars to match coordinates
    firstx = xRange.invert(pixelx1);
    firsty = yRange.invert(pixely1);
    secondx = xRange.invert(pixelx2);
    secondy = yRange.invert(pixely2);


    redoXs();
}

function redoXs() {
    xtwo = (75 - slider) / 50;
    xone = (secondy - firsty) / (secondx - firstx) - xtwo * (secondx + firstx);
    xzero = firsty - (xtwo * firstx * firstx) - ((secondy - firsty) / (secondx - firstx)) * firstx + xtwo * (firstx + secondx) * firstx;
}

//gets corresponding y from x and coefficients
function getY(xval) {
    return (xval * xval * xtwo + xval * xone + xzero);
}

function displayVals() {}

function updateLineData() {
    //resets and fills points
    /*
    if (firstx < secondx) {
        bigX = secondx;
        smallX = firstx;
    } else if (firstx == secondx) {
        smallX = 1;
        bigX = -2;
    } else {
        bigX = firstx;
        smallX = secondx;
    }
    */
    lineData = [];
    for (i = (originx1 - 1); i < (originx2 + 2); i = i + .1) {
        lineData.push({
            x: i,
            y: getY(i)
        });
    }

}
//makes dots for static points
function makeDots(xvalue, xvalue2) {
    nodes = [{
        x: xvalue,
        y: getY(xvalue)
            }, {
        x: xvalue2,
        y: getY(xvalue2)
            }];

}
/*
function updateBars() {
    var existingBar = document.querySelectorAll(".myBars");
    existingBarutransition();
    // update the data on each data point defined by 'propertyNames'
    existingBar.select("myBars" + function (d) {
            return d.colour;
        })
        .transition().ease("linear").duration(300)
        .attr("y", barY(data, propertyNames[index]))
        .attr("height", barHeight(data, propertyNames[index]));
}
*/
//function makeLine() {}

$(document).ready(function () {
    redoXs();

    updateLineData();
    displayVals();

    var vis = d3.select('#visual'),
        WIDTH = 1000,
        HEIGHT = 350,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        }
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
        return d.x;
    }), d3.max(lineData, function (d) {
        return d.x;
    })])
    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
        return d.y - 1;
    }), d3.max(lineData, function (d) {
        return d.y;
    })])

    //setup x
    var xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(5)
        .tickSubdivide(true),

        //setup y
        yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(5)
        .orient("left")
        .tickSubdivide(true);


    vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    vis.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    var lineFunc = d3.svg.line()
        .x(function (d) {
            return xRange(d.x);
        })
        .y(function (d) {
            return yRange(d.y);
        });

    vis.append("svg:path")
        .attr("class", "myLine")
        .attr("d", lineFunc(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    makeDots(firstx, secondx);

    //behavior for a dragged point
    var drag = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on("drag", dragmove);

    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")");

        //events to update line to fit dots
        updateXs();
        updateLineData();

        //update line
        d3.select(".myLine").transition()
            .attr("d", lineFunc(lineData));

    }

    //puts in dots
    vis.selectAll(".nodes")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "nodes")
        .attr("cx", function (d) {
            return xRange(d.x);
        })
        .attr("cy", function (d) {
            return yRange(d.y);
        })
        .attr("r", "10px")
        .attr("fill", "black")
        .attr("transform", function (p) {
            return "translate(" + p.x + "," + p.y + ")";
        })
        .call(drag);

    //Bar Graph

    var canvas = d3.select("#canvas");
    canvas.width = 500;
    canvas.height = 350;
    var values = [xtwo, xone, xzero];

    var colours = ['#FA0', '#0AF', '#AF0'];

    var yOffset = 0;

    //create scale
    yRange2 = d3.scale.linear().range([canvas.height - MARGINS.top,
MARGINS.bottom]).domain([0, 10]);

    //Process the data

    for (var i = 0; i < values.length; i++) {

        var datum = {

            value: yRange2(values[i]),
            colour: colours[i],
            x: 0,
            y: yOffset

        }

        yOffset += (canvas.height - MARGINS.top - datum.value);

        data.push(datum)
    }

    //setup y
    yAxis2 = d3.svg.axis()
        .scale(yRange2)
        .tickSize(5)
        .orient("left")
        .tickSubdivide(true);

    canvas.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis2);

    var bars = canvas.selectAll('rect').data(data)

    var cumValues = 0;
    bars
        .enter()
        .append('rect')
        .attr("class", "myBars" + function (d) {
            return d.colour;
        })
        .attr({
            width: 30,
            x: 60,
            y: function (d) {
                return d.value - d.y;
            },
            height: function (d) {
                return canvas.height - MARGINS.top - d.value;
            }
        })
        .style({
            fill: function (d) {
                return d.colour
            }
        });


    //updates when slider changes
    $("#myRange").change(function () {
        slider = $("#myRange").val();

        updateXs();
        updateLineData();
        displayVals();

        //update line
        d3.select(".myLine").transition()
            .attr("d", lineFunc(lineData));

        //update bars
        cumValues = 0;
        yOffset = 0;
        data = [];
        var values = [Math.abs(xtwo), Math.abs(xone), Math.abs(xzero)];
        for (var i = 0; i < values.length; i++) {

            var datum = {

                value: yRange2(values[i]),
                colour: colours[i],
                x: 0,
                y: yOffset

            }
            yOffset += (canvas.height - MARGINS.top - datum.value);

            data.push(datum)
        }
        console.log(xtwo, xone, xzero);
        bars = canvas.selectAll('rect').data(data)
            .style("fill", function (d) {
                return d.colour;
            })
            .attr({
                y: function (d) {
                    return d.value - d.y;
                },
                height: function (d) {
                    return canvas.height - MARGINS.top - d.value;
                }
            })
            .transition(); //update works

    });
});
