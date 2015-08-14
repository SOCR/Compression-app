var slider = $("#myRange").val();
var slider2 = $("#myRange2").val();
var xthree;
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
var graphType = $("input[name=type]:checked").val();

//updates coefficients
function updateXs() {

    var pixelx1 = xRange(originx1) + nodes[0].x;
    var pixely1 = yRange(originy1) + nodes[0].y;
    var pixelx2 = xRange(originx2) + nodes[1].x;
    var pixely2 = yRange(originy2) + nodes[1].y;
    var pixelx3 = xRange(originx3) + nodes[2].x;
    var pixely3 = yRange(originy3) + nodes[2].y;

    //update vars to match coordinates
    firstx = xRange.invert(pixelx1);
    firsty = yRange.invert(pixely1);
    secondx = xRange.invert(pixelx2);
    secondy = yRange.invert(pixely2);
    thirdx = xRange.invert(pixelx3);
    thirdy = xRange.invert(pixely3);


    redoXs();
}

function redoXs() {
    //always a dynamic variable
    xone = (slider) / 50;
    /*
        //variables for use in equation
        var varK = (firsty - secondy) / (Math.pow(firstx, 3) - Math.pow(secondx, 3));
        var varL = (firstx - secondx) / (Math.pow(firstx, 3) - Math.pow(secondx, 3));
        var varM = (Math.pow(firstx, 2) - Math.pow(secondx, 2)) / (Math.pow(firstx, 3) - Math.pow(secondx, 3));

        var varAlpha = (firsty - (varK * Math.pow(firstx, 3))) / (Math.pow(firstx, 2) - Math.pow(firstx, 3) * varM);

        var varBeta = 1 / (Math.pow(firstx, 2) - Math.pow(firstx, 3) * varM);

        var varDelta = (firstx - Math.pow(firstx, 3) * varL) / (Math.pow(firstx, 2) - Math.pow(firstx, 3) * varM);
    */
    //variables for equation
    if (graphType == 2) {
        xzero = (slider2) / 50;
    } else {
        xzero = (thirdy - (firsty * Math.pow(thirdx, 3) / Math.pow(firstx, 3)) + (secondy * Math.pow(thirdx, 3) / firstx) - (Math.pow(thirdx, 3) * (firsty * Math.pow(secondx, 3) / Math.pow(firstx, 3)) / firstx) + (Math.pow(thirdx, 3) * (xone * (secondx, 3) / Math.pow(xone, 2)) / firstx) + (xone * Math.pow(thirdx, 3) / Math.pow(firstx, 2)) - secondy * Math.pow(thirdx, 2) + (firsty * Math.pow(secondx, 3) * Math.pow(thirdx, 2) / Math.pow(firstx, 3)) - (xone * Math.pow(secondx, 3) * Math.pow(thirdx, 2) / Math.pow(firstx, 2)) + (xone * secondx * Math.pow(thirdx, 2)) - xone * thirdx) / (1 + (Math.pow(secondx, 3) * Math.pow(thirdx, 2) / Math.pow(firstx, 3)) + (Math.pow(thirdx, 3) / firstx) - Math.pow(thirdx, 2) - (Math.pow(secondx, 3) * Math.pow(thirdx, 3) * (1 / Math.pow(firstx, 3)) / firstx))
    }
    xtwo = (secondy - (firsty * Math.pow(secondx, 3) / Math.pow(firstx, 3)) + (xone * Math.pow(secondx, 3) / Math.pow(firstx, 2)) + (xzero * Math.pow(secondx, 3) / Math.pow(firstx, 3)) - xone * secondx - xzero) / (Math.pow(secondx, 2) - (Math.pow(secondx, 3) / firstx));
    xthree = (firsty / Math.pow(firstx, 3)) - (xtwo / firstx) - (xone / Math.pow(firstx, 2)) - (xzero / Math.pow(firstx, 3));
}

//gets corresponding y from x and coefficients
function getY(xval) {
    return (Math.pow(xval, 3) * xthree + xval * xval * xtwo + xval * xone + xzero);
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
    for (i = (originx1 - 1); i < (originx3 + 2); i = i + .1) {
        lineData.push({
            x: i,
            y: getY(i)
        });
    }

}
//makes dots for static points
function makeDots(xvalue, xvalue2, xvalue3) {
    nodes = [{
            x: xvalue,
            y: getY(xvalue)
            }, {
            x: xvalue2,
            y: getY(xvalue2)
            },
        {
            x: xvalue3,
            y: getY(xvalue3)
             }
                 ];

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
    console.log(thirdx, thirdy);
    redoXs();

    updateLineData();


    if (graphType == 1) {
        $("#myRange2").hide();
    } else {

        $("#myRange2").show();
    }


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

    makeDots(firstx, secondx, thirdx);

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
    var values = [Math.abs(xthree), Math.abs(xtwo), Math.abs(xone), Math.abs(xzero)];

    var colours = ['#A0F', '#FA0', '#0AF', '#AF0'];

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

    //update when buttons change
    $("input[type]:radio").change(function () {
        graphType = $("input[name=type]:checked").val()


        if (graphType == 1) {
            $("#myRange2").hide();
            //    nodes[2].style("opacity", "1");
        } else {
            //   nodes[2].style("opacity", "0");
            $("#myRange2").show();
        }

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
        var values = [Math.abs(xthree), Math.abs(xtwo), Math.abs(xone), Math.abs(xzero)];
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
        var values = [Math.abs(xthree), Math.abs(xtwo), Math.abs(xone), Math.abs(xzero)];
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

    $("#myRange2").change(function () {
        slider2 = $("#myRange2").val();

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
        var values = [Math.abs(xthree), Math.abs(xtwo), Math.abs(xone), Math.abs(xzero)];
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
