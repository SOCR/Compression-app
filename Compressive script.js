var slider = $("#myRange").val();
var slider2 = $("#myRange2").val();
var text;
var text2;
var xthree;
var xtwo;
var xone;
var xzero;
var firstx = -1;
var firsty = -4;
var secondx = 2;
var secondy = 4;
var thirdx = 4;
var thirdy = 1;
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
var bars;
var barMARGINS;
var useZoom = $('#zoom').is(":checked");

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
    thirdy = yRange.invert(pixely3);


    redoXs();
}

function roundNum(roundee, type) {
    // return (Math.round(roundee * 100)) / 100;
    var newNum = Math.abs(roundee),
        eVar = 0;

    //rounds scientifically
    while (newNum < 1 || newNum >= 10) {
        if (newNum == 0) {
            break;
        } else if (newNum < 1) {
            newNum *= 10;
            eVar--;
        } else if (newNum >= 10) {
            newNum /= 10;
            eVar++;
        }
    }

    newNum = (Math.round(newNum * 1000)) / 1000;


    //displays rounded num. for first number in equation
    if (type == 1) {
        //console.log("original number: " + roundee + " rounded: " + newNum + " evar: " + eVar);
        return newNum + "e^{" + eVar + "}";
    } else {

        return [newNum, eVar];
    }

}

function displayNum(display, color) {
    //uses roundnum to get scino values
    var vals = roundNum(display, 2);

    if (display < 0) {
        return "\\color{#000}{ - } \\color{" + color + "}{" + vals[0] + "e^{" + vals[1] + "}}";
    } else {
        return "\\color{#000}{ + } \\color{" + color + "}{" + vals[0] + "e^{" + vals[1] + "}}";
    }
}

function getRange() {
    Array.max = function (array) {
        return Math.max.apply(Math, array);
    };

    Array.min = function (array) {
        return Math.min.apply(Math, array);
    };

    var pointsArray = [firstx, secondx, thirdx]

    var minimum = Array.min(pointsArray);
    var maximum = Array.max(pointsArray);

    minimum -= (Math.abs((maximum - minimum) / 2));
    maximum += (Math.abs((maximum - minimum) / 2));

    if (Math.abs(maximum) > Math.abs(minimum)) {
        rangeStandard = Math.abs(maximum)
    } else {
        rangeStandard = Math.abs(minimum);
    }

    rangeStandard = 100;
}

function redoXs() {
    //always a dynamic variable HERE LAYS A SLIDER EQ
    getRange();
    xzero = (slider) * (rangeStandard / 50) - (rangeStandard);

    //vars for use in equation
    var varM = (firsty / Math.pow(firstx, 3));
    var varN = 1 / firstx;
    var varP = 1 / (Math.pow(firstx, 2));
    var varQ = 1 / (Math.pow(firstx, 3));
    var varZ = 1 / (Math.pow(secondx, 2) - varN * Math.pow(secondx, 3));

    var varAlpha = (varP * Math.pow(secondx, 3) - secondx) * varZ;
    var varBeta = (varQ * Math.pow(secondx, 3) - 1) * varZ;
    var varGamma = (-varM * Math.pow(secondx, 3) + secondy) * varZ;

    var varI = (Math.pow(thirdx, 2) * (thirdx * (varM - varN * varGamma) + varGamma));
    var varJ = (thirdx + Math.pow(thirdx, 2) * (varAlpha - thirdx * (varP + varAlpha * varN)));
    var varK = (1 + Math.pow(thirdx, 2) * (varBeta - thirdx * (varQ + varBeta * varN)));

    //variables for equation SLIDER EQ
    if (graphType == 2) {
        xone = (slider2) * (rangeStandard / 50) - (rangeStandard);
    } else {
        xone = (thirdy - varI - xzero * varK) / (varJ);
    }
    xtwo = xone * varAlpha + xzero * varBeta + varGamma;
    //xtwo = (Math.pow(secondx, 3) * (xone * varP + varQ * xzero - varQ * firsty) + secondy - xone * secondx - xzero) / (Math.pow(secondx, 2) - varN * Math.pow(secondx, 3));
    xthree = varM - varN * xtwo - varP * xone - varQ * xzero;


    /*
        var mathDiv = document.getElementById('math');
        var displayDiv = document.getElementById('demo');

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "math"]);
        MathJax.Hub.Queue(function () {
            var math = MathJax.Hub.getAllJax("MathDiv")[0];

            MathJax.Hub.Queue(["Text", math, "$y = \\color{#A0F}{" + roundNum(xzero, 1) + displayNum(xone, "#FA0") + "x}" + displayNum(xtwo, "#0AF") + "x^2" + displayNum(xthree, "#AF0") + "x^3$"]);
            MathJax.Hub.Queue(function () {
                displayDiv.innerHTML = mathDiv.innerHTML;
            });

        });*/

    //output equation
    document.getElementById("demo").innerHTML = "$y = \\color{#A0F}{" + roundNum(xzero, 1) + displayNum(xone, "#FA0") + "x}" + displayNum(xtwo, "#0AF") + "x^2" + displayNum(xthree, "#AF0") + "x^3$";
    MathJax.Callback.Queue(["Typeset", MathJax.Hub, "demo"]);

    //document.getElementById("demo").innerHTML = "$y =  $" + roundNum(xzero) + displayNum(roundNum(xone)) + "$x$" + displayNum(roundNum(xtwo)) + "$x^2$" + displayNum(roundNum(xthree)) + "$x^3$";

    //$\color{#AF0}{a}+\color{#FA0}{b}+\color{#0AF}{c}+\color{#A0F}{d}$

    // document.getElementById("demo").innerHTML = "y = " + xthree + "x^3 " + "+ " + xtwo + "x^2 + " + xone + "x + " + xzero;
}

//gets corresponding y from x and coefficients
function getY(xval) {
    return (Math.pow(xval, 3) * xthree + xval * xval * xtwo + xval * xone + xzero);
}



function setSlider() {
    findCompression();
    getRange();
    document.getElementById("myText").value = (smallestX);
    if (graphType == 2) {
        document.getElementById("myText2").value = (smallestSecondX);
    }
    $("#myText").trigger("change");
    $("#myText2").trigger("change");

}

function updateLineData() {
    //resets and fills points
    lineData = [];
    for (i = (originx1 - 1); i < (originx3 + 2); i = i + .1) {
        lineData.push({
            x: i,
            y: getY(i)
        });

    }

}

//redoes the line completely
function redoLine() {
    updateLineData();

    //update line
    d3.select(".myLine").transition()
        .attr("d", lineFunc(lineData));
}

//zooms view out


function updateBars(canvas) {
    cumValues = 0;
    yOffset = 0;
    data = [];

    //---
    var values = [{
        cValue: Math.abs(xzero),
        color: '#A0F'
    }, {
        cValue: Math.abs(xone),
        color: '#FA0'
    }, {
        cValue: Math.abs(xtwo),
        color: '#0AF'
    }, {
        cValue: Math.abs(xthree),
        color: '#AF0'
    }];

    //set scale
    scaleBarGraph(values[0].cValue, values[1].cValue, values[2].cValue, values[3].cValue);

    for (var i = 0; i < values.length; i++) {

        var datum = {

            value: yRange2(values[i].cValue),
            colour: values[i].color,
            y: 0,
            x: yOffset

        }
        yOffset += (datum.value);
        data.push(datum)
    }

    bars = canvas.selectAll('rect').data(data)

    bars
        .attr({
            x: function (d) {
                return barMARGINS.left + d.x;
            },
            width: function (d) {
                return d.value;
            }
        })
        .style({
            fill: function (d) {
                return d.colour
            }
        })
        .transition();
}

//makes dots for static points
function makeDots(xvalue, xvalue2, xvalue3) {
    nodes = [{
            x: xvalue,
            y: getY(xvalue),
            //represents initial starting points in pixel coords
            initx: xvalue,
            inity: getY(xvalue),
            //represents distance from rectangle to circle in pan func
            xDistance: -1,
            yDistance: -1

            }, {
            x: xvalue2,
            y: getY(xvalue2),
            initx: xvalue2,
            inity: getY(xvalue2),
            xDistance: -1,
            yDistance: -1
            }, {
            x: xvalue3,
            y: getY(xvalue3),
            initx: xvalue3,
            inity: getY(xvalue3),
            xDistance: -1,
            yDistance: -1
             }
                 ];

}

function findCompression() {
    var smallestCVal = 100;
    smallestX = -1;
    smallestSecondX = -1;


    for (var j = -100; j < 100; j += 1) {
        xzero = j;

        var varM = (firsty / Math.pow(firstx, 3));
        var varN = 1 / firstx;
        var varP = 1 / (Math.pow(firstx, 2));
        var varQ = 1 / (Math.pow(firstx, 3));
        var varZ = 1 / (Math.pow(secondx, 2) - varN * Math.pow(secondx, 3));
        var varAlpha = (varP * Math.pow(secondx, 3) - secondx) * varZ;
        var varBeta = (varQ * Math.pow(secondx, 3) - 1) * varZ;
        var varGamma = (-varM * Math.pow(secondx, 3) + secondy) * varZ;

        var varI = (Math.pow(thirdx, 2) * (thirdx * (varM - varN * varGamma) + varGamma));
        var varJ = (thirdx + Math.pow(thirdx, 2) * (varAlpha - thirdx * (varP + varAlpha * varN)));
        var varK = (1 + Math.pow(thirdx, 2) * (varBeta - thirdx * (varQ + varBeta * varN)));

        //variables for equation
        if (graphType == 1) {
            xone = (thirdy - varI - xzero * varK) / (varJ);

            xtwo = xone * varAlpha + xzero * varBeta + varGamma;
            xthree = varM - varN * xtwo - varP * xone - varQ * xzero;

            if ((Math.abs(xthree) + Math.abs(xtwo) + Math.abs(xone) + Math.abs(xzero)) < smallestCVal) {
                smallestCVal = (Math.abs(xthree) + Math.abs(xtwo) + Math.abs(xone) + Math.abs(xzero));
                smallestX = j;

                if (j > 0) {
                    console.log("asdf" + j);
                }
            }
        } else {
            for (var k = -100; k < 100; k += 1) {
                //xone becomes second loop dependent
                xone = k;

                xtwo = xone * varAlpha + xzero * varBeta + varGamma;
                xthree = varM - varN * xtwo - varP * xone - varQ * xzero;

                //checks if cvals are greatest
                if ((Math.abs(xthree) + Math.abs(xtwo) + Math.abs(xone) + Math.abs(xzero)) < smallestCVal) {
                    smallestCVal = (Math.abs(xthree) + Math.abs(xtwo) + Math.abs(xone) + Math.abs(xzero));
                    smallestX = j;
                    smallestSecondX = k;
                }
            }
        }
    }








}



$(document).ready(function () {
    //redefine coefficient variables
    redoXs();

    //define line points
    updateLineData();

    //hides slider depending on option
    if (graphType == 1) {
        document.getElementById("myText2").style.visibility = "hidden";
        $("#myRange2").hide();
    } else {
        document.getElementById("myText2").style.visibility = "visible";
        $("#myRange2").show();
    }

    //graph objects for line graph are defined
    vis = d3.select('#visual'),
        WIDTH = 1000,
        HEIGHT = 500,
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
        /*yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function (d) {
            return d.y - 1;
        }), d3.max(lineData, function (d) {
            return d.y + 2;
        })])*/
    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([-10, 10])

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

    //axes defined
    xAxisGroup = vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + yRange(0) + ")")
        .call(xAxis);

    yAxisGroup = vis.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + xRange(0) + ",0)")
        .call(yAxis);

    lineFunc = d3.svg.line()
        .x(function (d) {
            return xRange(d.x);
        })
        .y(function (d) {
            return yRange(d.y);
        });

    //define line
    vis.append("svg:path")
        .attr("class", "myLine")
        .attr("d", lineFunc(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    //define 3 "static" points
    makeDots(firstx, secondx, thirdx);

    //behavior for a dragged point
    var drag = d3.behavior.drag()
        /*.origin(function (d) {
            var t = d3.select(this);
            return {
                x: t.attr("x"),
                y: t.attr("y")
            };
        })*/
        .origin(function (d) {
            var bbox = this.getBBox();
            console.log(bbox.y);
            return {
                x: bbox.x,
                y: bbox.y

            };
        })
        .on("dragstart", dragstarter)
        .on("drag", dragmove);

    //define zoom behavior
    var zoom = d3.behavior.zoom().center([xRange(0), yRange(0)])
        .on("zoom", draw);

    /*vis.call(zoom)
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);;
    */
    zoom.y(yRange);

    var selectionBox, p;

    function dragstarter(d) {
        //d3.select('g').node()
        //document.querySelector("#visual")

        var point = d3.mouse(d3.select('g').node()),
            tempP = {
                x: point[0],
                y: point[1]
            };

        p = {
            x: point[0],
            y: point[1]
        };

        //console.log("start: " + this.nodeName);
        if (this.nodeName === "rect") {

            d3.event.sourceEvent.stopPropagation();
            //console.log("rectangle start");

            d3.select(this).style({
                opacity: 0.1
            })
        } else if (this.nodeName === "circle") {
            d3.event.sourceEvent.stopPropagation();
            //console.log("point start");
        } else {
            // Extract the click location
            console.log("canvas start");
            var point = d3.mouse(this);



            //remove previous rectangles
            vis.selectAll("rect").remove();


            //console.log("canv drag start " + p.x);
            selectionBox = vis.append("rect")
                .attr("x", p.x)
                .attr("y", p.y)
                .attr("width", 0)
                .attr("height", 0)
                .style("opacity", 0.5)
                .style("fill", "#03B8FC")
                .style("stroke", "#0074D3")
                //.call(drag);
        }
    }


    //function for dragging points
    function dragmove(d) {

        var select = d3.selectAll("svg").filter(function (d, i) {
            return i === 1;
        });
        var foo = select.node();

        var barz = document.querySelector("#visual");

        var point = d3.mouse(barz),
            tempP = {
                x: point[0],
                y: point[1]
            };

        //console.log("drag: " + this.nodeName);
        //console.log("y=" + tempP.y);

        if (this.nodeName === "rect") {
            d3.event.sourceEvent.stopPropagation();


            d3.select(this).style({
                opacity: 0.05
            })

            //console.log("x " + selectionBox.x + " lx " + selectionBox.x + selectionBox.width);
            var selectRect = d3.select(this);


            var selected = vis.selectAll("circle").filter(function (d, i) {
                    //returns circles within rectangle
                    return ((xRange(d.x) > selectRect.attr("x") && xRange(d.x) < (+selectRect.attr("x") + +selectRect.attr("width"))) &&
                        (yRange(d.y) > selectRect.attr("y") && yRange(d.y) < (+selectRect.attr("y") + +selectRect.attr("height")))
                    )
                }, this)
                .attr("transform", "translate(" + (this.x = tempP.x) + "," + (this.y = tempP.y - (d3.select(this).attr("inity"))) + ")")
                .style({
                    opacity: 0.1

                });

            console.log(vis.selectAll("circle").x)

        } else
        if (this.nodeName === "circle") {

            d3.event.sourceEvent.stopPropagation();
            //console.log("y2=" + tempP.y);

            var useZoom = $('#zoom').is(":checked");
            //console.log("point drag");
            if (useZoom == false) {


                d3.select(this).attr("transform", "translate(" + (d.x = tempP.x - xRange(d.initx)) + "," + (d.y = tempP.y - yRange(d.inity)) + ")");
                //console.log("point calc: " + tempP.x + " - " + d.initx + " = " + d.x);
                /*
                                d3.select(this).attr({
                                    cx: tempP.x,
                                    cy: tempP.y
                                })
                */
                //console.log("y3=" + tempP.y);

                //events to update line to fit dots
                updateXs();
                redoLine();
                //console.log("y4=" + tempP.y);

                //update bars

                updateBars(canvas);
                //console.log("y5=" + tempP.y);


                findCompression();
                //console.log("y6=" + tempP.y);

                console.log("standard" + nodes[1].inity + " invyranged" + yRange.invert(nodes[1].inity));
                console.log("tempP.y" + tempP.y + " d.inity" + d.inity);
                console.log(nodes[1].y);

            }
        } else {

            console.log("canv drag")

            //p.x/y represent initial point where drag started
            //tempP represents current mouse point

            /*var point = d3.mouse(this),
                tempP = {
                    x: point[0],
                    y: point[1]
                };
                */

            selectionBox.attr({
                width: Math.abs(p.x - tempP.x),
                height: Math.abs(p.y - tempP.y)
            })

            if (tempP.x - p.x < 0) {
                selectionBox.attr({
                    x: p.x + (tempP.x - p.x)
                })
            }

            if (tempP.y - p.y < 0) {
                selectionBox.attr({
                    y: p.y + (tempP.y - p.y)
                })
            }
        }
        //console.log("yfin=" + tempP.y);
    }

    circleAttrs = {
        cx: function (d) {
            return xRange(d.x);
        },
        cy: function (d) {
            return yRange(d.y);
        }
    };

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
        .attr("r", "7px")
        .attr("fill", "black")
        .attr("transform", function (p) {
            return "translate(" + p.x + "," + p.y + ")";
        })
        .call(drag);

    //vis.call(drag);

    //update textboxes to fit sliders SLIDER EQ
    getRange();
    document.getElementById("myText").value = slider * (rangeStandard / 50) - (rangeStandard);
    document.getElementById("myText2").value = slider2 * (rangeStandard / 50) - (rangeStandard);

    /*Bar Graph*/

    var canvas = d3.select("#canvas");
    canvas.width = 100;
    canvas.height = 500;
    barMARGINS = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    }

    //rectangle values
    //---
    var values = [{
        cValue: Math.abs(xzero),
        color: '#A0F'
    }, {
        cValue: Math.abs(xone),
        color: '#FA0'
    }, {
        cValue: Math.abs(xtwo),
        color: '#0AF'
    }, {
        cValue: Math.abs(xthree),
        color: '#AF0'
    }];


    var yOffset = 0;

    //create scale
    //yRange2 = d3.scale.linear().range([canvas.height - MARGINS.top,
    //MARGINS.bottom]).domain([0, 10]);

    //yrange2- imp-Set domain to be set to biggest number
    yRange2 = d3.scale.linear()
        .domain([0, 10])
        .range([barMARGINS.bottom, canvas.height - barMARGINS.top]);

    //Process the data

    for (var i = 0; i < values.length; i++) {

        var datum = {

            value: yRange2(values[i].cValue),
            colour: values[i].color,
            y: 0,
            x: yOffset

        }

        yOffset += (datum.value);
        data.push(datum)
    }

    //setup y
    yAxis2 = d3.svg.axis()
        .scale(yRange2)
        .tickSize(5)
        .orient("bottom")
        .tickSubdivide(true);

    barAxisGroup = canvas.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (3 * MARGINS.bottom) + ")")
        .call(yAxis2);

    bars = canvas.selectAll('rect').data(data)

    var cumValues = 0;
    bars
        .enter()
        .append('rect')
        .attr("class", "myBars" + function (d) {
            return d.colour;
        })
        .attr({
            height: 30,
            y: 20,
            x: function (d) {
                return barMARGINS.left + d.x;
            },
            width: function (d) {
                return d.value;
            }
        })
        .style({
            fill: function (d) {
                return d.colour
            }



        });


    findCompression();

    //function to autoscale bar graph scale
    function scaleBarGraph(value1, value2, value3, value4) {

        var ValueSum = (value1 + value2 + value3 + value4)

        //update axis
        yRange2.domain([0, (ValueSum + (ValueSum / 10))])

        //console.log(value1 + "," + value2 + " " + value3 + " " + value4 + "   " + (value1 + value2 + value3 + value4));

        barAxisGroup.transition().call(yAxis2);



    }
    window.scaleBarGraph = scaleBarGraph;

    function draw() {
        console.log("drawing");

        vis.select("g.x.axis").call(xAxis);
        vis.select("g.y.axis").call(yAxis);


        var c = vis.selectAll("circle")

        var movingCircleAttrs = {
            cx: function (d) {
                return xRange(d.x);
            },
            cy: function (d) {
                console.log("y" + nodes[1].y + " range y" + yRange(nodes[1].y) + " invrange y" + yRange.invert(nodes[1].y));
                return d.y;
            }
        };

        c.attr(circleAttrs)

        console.log(nodes[1].y);

        d3.select(".myLine")
            .attr("d", lineFunc(lineData));
    }

    //function to zoom graph to fit whole curve
    function zoomOut() {


        //update axis

        yRange.domain([d3.min(lineData, function (d) {
            return d.y - 10;
        }), d3.max(lineData, function (d) {
            return d.y + 10;
        })])

        yAxisGroup.transition().call(yAxis);

        xAxisGroup.transition().attr("transform", "translate(0," + yRange(0) + ")");

        //update line
        d3.select(".myLine").transition()
            .attr("d", lineFunc(lineData));



        var c = vis.selectAll("circle")

        c.transition()
            .attr(circleAttrs)

        console.log(firstx);

    }

    window.zoomOut = zoomOut;

    //restores view
    function restoreView() {
        //update axis
        yRange.domain([-10, 10])

        yAxisGroup.transition().call(yAxis);

        xAxisGroup.transition().attr("transform", "translate(0," + yRange(0) + ")");

        //update line
        d3.select(".myLine").transition()
            .attr("d", lineFunc(lineData));

        var c = vis.selectAll("circle")

        c.transition()
            .attr(circleAttrs)


    }

    window.restoreView = restoreView;


    $(':checkbox').change(function () {

        useZoom = $('#zoom').is(":checked");

        if (useZoom == 1) {
            zoomOut();
        } else {
            restoreView();
        }

    });

    //update when buttons change
    $("input[type]:radio").change(function () {
        graphType = $("input[name=type]:checked").val()


        if (graphType == 1) {
            document.getElementById("myText2").style.visibility = "hidden";

            $("#myRange2").hide();
            //nodes[2].style("opacity", "0");
        } else {
            //   nodes[2].style("opacity", "0");

            document.getElementById("myText2").style.visibility = "visible";
            $("#myRange2").show();
        }

        updateXs();
        redoLine();

        //update bars

        updateBars(canvas);
    });
    //updates when text boxes change
    $("#myText").change(function () {
        getRange();
        text = $("#myText").val();
        slider = (Number(text) + rangeStandard) / (rangeStandard / 50);
        document.getElementById("myRange").value = slider;


        updateXs();
        redoLine();

        if (useZoom == 1) {
            zoomOut();
        }

        //update bars
        updateBars(canvas);
        /* cumValues = 0;
        yOffset = 0;
        data = [];

        //---
        var values = [{
            cValue: Math.abs(xzero),
            color: '#A0F'
    }, {
            cValue: Math.abs(xone),
            color: '#FA0'
    }, {
            cValue: Math.abs(xtwo),
            color: '#0AF'
    }, {
            cValue: Math.abs(xthree),
            color: '#AF0'
    }];

        for (var i = 0; i < values.length; i++) {

            var datum = {

                value: yRange2(values[i].cValue),
                colour: values[i].color,
                y: 0,
                x: yOffset

            }
            yOffset += (datum.value);
            data.push(datum)
        }

        bars = canvas.selectAll('rect').data(data)

        bars
            .attr({
                x: function (d) {
                    return barMARGINS.left + d.x;
                },
                width: function (d) {
                    return d.value;
                }
            })
            .style({
                fill: function (d) {
                    return d.colour
                }
            })
            .transition();
*/

        findCompression();
    });
    //updates when second text box changes
    $("#myText2").change(function () {

        getRange();
        text2 = $("#myText2").val();
        slider2 = (Number(text2) + rangeStandard) / (rangeStandard / 50);
        document.getElementById("myRange2").value = slider2;


        updateXs();
        redoLine();

        if (useZoom == 1) {
            zoomOut();
        }

        //update bars

        updateBars(canvas);


        findCompression();
    });

    //updates when slider changes
    $("#myRange").change(function () {
        slider = $("#myRange").val();
        document.getElementById("myText").value = slider * 2 - 100;


        updateXs();
        redoLine();

        if (useZoom == 1) {
            zoomOut();
        }

        //update bars

        updateBars(canvas);

        findCompression();

    });

    $("#myRange2").change(function () {
        slider2 = $("#myRange2").val();
        document.getElementById("myText2").value = slider2 * 2 - 100;


        updateXs();
        redoLine();

        if (useZoom == 1) {
            zoomOut();
        }

        //update bars

        updateBars(canvas);
    });
});
