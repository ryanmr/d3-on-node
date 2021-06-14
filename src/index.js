const d3 = require("d3");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { createCanvas, Image } = require("node-canvas");
const fs = require("fs");
const { rejects } = require("assert");

const canvasWidth = 960;
const canvasHeight = 500;

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext("2d");

// create a new JSDOM instance for d3-selection to use
const document = new JSDOM().window.document;

async function make() {
  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

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
  const data = d3.csvParse(getSalesCsvExample().trim());
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

  await toPng(id);
}

async function make2() {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 30, left: 10 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

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
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("fill", "#ffffff");

  svg
    .append("rect")
    .attr("x", function (d) {
      return 0;
    })
    .attr("y", function (d) {
      return 0;
    })
    .attr("width", function (d) {
      return canvasWidth;
    })
    .attr("height", function (d) {
      return canvasHeight;
    })
    .style("fill", "#ffffff");

  const data = d3.csvParse(getTreeChartCsv());
  console.log(data);

  // stratify the data: reformatting for d3.js
  var root = d3
    .stratify()
    .id(function (d) {
      return d.name;
    }) // Name of the entity (column name is name in csv)
    .parentId(function (d) {
      return d.parent;
    })(
    // Name of the parent (column name is parent in csv)
    data
  );

  root.sum(function (d) {
    return +d.value;
  }); // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  console.log(root);

  d3.treemap().size([width, height]).padding(4)(root);

  // use this information to add rectangles:
  svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0 + 25;
    })
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .style("stroke", "rgba(0,0,0,.5)")
    .style("stroke-width", "1")
    .style("stroke-opacity", "0.8")
    .style("fill", (d) => {
      if (d.data.name === "Early") {
        return "#a87932";
      } else if (d.data.name === "On Time") {
        return "#32a852";
      } else if (d.data.name === "Late") {
        return "#a83c32";
      }
      return "#ffffff";
    });

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 10;
    }) // +10 to adjust position (more right)
    .attr("y", function (d) {
      return d.y0 + 20 + 30;
    }) // +20 to adjust position (lower)
    .text(function (d) {
      return d.data.name;
    })
    .attr("font-size", "24px")
    .attr("fill", "white")
    .style("font-family", "sans-serif");

  svg
    .selectAll("titles")
    .data(
      root.descendants().filter(function (d) {
        return d.depth == 1;
      })
    )
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 5;
    })
    .attr("y", function (d) {
      return d.y0 + 24;
    })
    .text(function (d) {
      return d.data.name;
    })
    .attr("font-size", "24px")
    .attr("fill", "#000000")
    .style("font-family", "sans-serif");

  toPng(id);
}

async function toPng(id) {
  const svgHtml = document.getElementById(id).outerHTML;
  console.log(svgHtml);

  const image = await loadSvgAsync(svgHtml);

  ctx.drawImage(image, 0, 0);

  const png = canvas.toBuffer();

  const filename = `./output-1.png`;
  fs.writeFileSync(filename, png);
  console.log("file is done");
}

function loadSvgAsync(svgHtml) {
  const promise = new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };

    img.src = `data:image/svg+xml;utf8,${svgHtml}`;
  });

  return promise;
}

function getSalesCsvExample() {
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

function getTreeChartCsv() {
  return `
name,parent,value
Origin1,,
F1,Origin1,
Early,F1,1
On Time,F1,1
Late,F1,1
    `.trim();
}

make2().then(() => {
  console.log("🐱 all done");
});
