var slider = $("#myRange").val();
var xtwo;
var xone;
var xzero;
var firstx = -1;
var firsty = 1;
var secondx = 2;
var secondy = 4;
var lineData = [];
var nodes = [];
var data = [];


//updates coefficients
function updateXs() {
    update vars to match coordinates
    firstx = nodes[0].x;
    firsty = nodes[0].y;
    secondx = nodes[1].x;
    secondy = nodes[1].y;

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
    lineData = [];
    for (i = (firstx - 1); i < (secondx + 2); i = i + .1) {
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
    existingBar.transition();
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
    updateXs();
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
        },
        xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function (d) {
            return d.x;
        }), d3.max(lineData, function (d) {
            return d.x;
        })]),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y - 1;
        }), d3.max(lineData, function (d) {
            return d.y;
        })]),

        //setup x
        xAxis = d3.svg.axis()
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

    var drag = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on("drag", dragmove);

    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")");
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
MARGINS.bottom]).domain([0, 5]);

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
        bars = canvas.selectAll('rect').data(data)
            .style("fill", function (d) {
                return d.colour;
            })
            .attr({
                y: function (d) {
                    return d.value - d.y;
                },
                height: function (d) {
                    console.log(d.value);
                    return canvas.height - MARGINS.top - d.value;
                }
            })
            .transition(); //update works

    });
});
