const d3 = require("d3");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { createCanvas, loadImage, Image } = require("node-canvas");
const fs = require("fs");

const canvas = createCanvas(960, 500);
const ctx = canvas.getContext("2d");

// create a new JSDOM instance for d3-selection to use
const document = new JSDOM().window.document;

function make() {
  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const id = `chart-${Date.now()}`;
  var svg = d3
    .select(document.body)
    .append("svg")
    .attr("id", id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  const data = d3.csvParse(getCsv().trim());
  console.log(data);
  // format the data
  data.forEach(function (d) {
    d.sales = +d.sales;
  });

  // Scale the range of the data in the domains
  x.domain(
    data.map(function (d) {
      return d.salesperson;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.sales;
    }),
  ]);

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.salesperson);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.sales);
    })
    .attr("height", function (d) {
      return height - y(d.sales);
    })
    .attr("fill", "#0000ff");

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));

  const html = document.getElementById(id).outerHTML;
  console.log(html);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
  img.onerror = (err) => {
    throw err;
  };
  img.src = `data:image/svg+xml;utf8,${html}`;
  //img.src = "./example.svg";

  const png = canvas.toBuffer();

  fs.writeFileSync(`./output-${Date.now()}.png`, png);
  console.log("file is done");
}

function getCsv() {
  return `
salesperson,sales
Bob,33
Robin,12
Anne,41
Mark,16
Joe,59
Eve,38
Karen,21
Kirsty,25
Chris,30
Lisa,47
Tom,5
Stacy,20
Charles,13
Mary,29
    `;
}

make();
