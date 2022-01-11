// Canvas definition
var svgWidth = 810;
var svgHeight = 500;

// Margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Dimensions
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG group to hold a chart shifted by left and top margins.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(censusData => {

    // console.log(censusData);
    // 1. Parse Data/Cast as numbers
    // The 'unary plus' operator (+) precedes its operand and evaluates to its operand
    // but attempts to convert it into a number, if it isn't already.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus
    censusData.forEach(row => {
       row.id = +row.id;
       row.poverty = +row.poverty;
       row.povertyMoe = +row.povertyMoe;
       row.age = +row.age;
       row.ageMoe = +row.ageMoe;
       row.income = +row.income;
       row.incomeMoe = +row.incomeMoe;
       row.healthcare = +row.healthcare;
       row.healthcareLow = +row.healthcareLow;
       row.healthcareHigh = +row.healthcareHigh;
       row.obesity = +row.obesity;
       row.obesityLow = +row.obesityLow;
       row.obesityHigh = +row.obesityHigh;
       row.smokes = +row.smokes;
       row.smokesLow = +row.smokesLow;
       row.smokesHigh = +row.smokesHigh;
    });
    // console.log(censusData);

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        // .domain([8, 22])
        .domain([Math.floor(d3.min(censusData, d => d.poverty)), Math.ceil(d3.max(censusData, d => d.poverty))])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, Math.ceil(d3.max(censusData, d => d.healthcare))+1])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    // Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "red")
        .attr("opacity", ".5");

    chartGroup.selectAll(".class1")     // text-circle doesn't exist so it appends all data
        .data(censusData)
        .enter()
        .append("text")
        .attr("class", "class1")
        .attr("style", "font-size:10")
        .attr("dx", d => xLinearScale(d.poverty) - 6)
        .attr("dy", d => yLinearScale(d.healthcare) +3)
        .text(function(d) {
            console.log(d.abbr)
            return d.abbr;
        });

    // Create group for two x-axis labels (xLengthLabel_1 and xLengthLabel_2)
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    xLengthLabel_1 = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")   // value for the event listener
        .classed("active", true)
        .text("In poverty (%)");

    // xLengthLabel_2 = labelsGroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 40)
    //     .attr("value", "healthcare") // value for the event listener
    //     .classed("inactive", true)
    //     .text("Lacks Healthcare (%)");

    // Apend y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");


    




    // chartGroup.append("text")

}).catch(function(error) {
    console.log(error);
});