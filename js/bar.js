const bar_dataset = [50, 43, 120, 87, 99, 167, 142];

const bar_width = 400;
const bar_height = 400;

let bar_svg = d3.select("div#bar").attr("align", "center")
    .append("svg")
    .attr("width", bar_width)
    .attr("height", bar_height);

const padding = {top: 30, right: 30, bottom: 20, left: 40};

const rectStep = 35;
const rectWidth = 30;

const paddingWidth = 4;


// call() 的参数是一个函数。调用之后，将当前的选择集作为参数传递给此函数
let xScale = d3.scale.ordinal()
    .domain(d3.range(0, bar_dataset.length))
    .rangeRoundBands([0, bar_width - padding.right - padding.left]);


// console.log(Math.floor(Math.random()*100));

// domain是x轴比例尺的定义域，定义了从某一数据区域映射到rangeRoundBands的范围，不同的比例尺有不同的映射方式
// （常用的比例尺有线型比例尺linear和序数比例尺ordinal，序数比例尺也即是离散的比例尺）
// 还有一种比例尺为量化比例尺，主要针对定义域是连续的，而值域是离散的情况


d3.select("div#bar")
    .append("br");

d3.select("div#bar")
    .append("button")
    .attr("type", "button")
    .attr("class", "sortbutton")
    .attr("onclick", "sort()")
    .text("排序");


d3.select("div#bar")
    .append("button")
    .attr("type", "button")
    .attr("class", "addbutton")
    .attr("onclick", "add()")
    .text("增加数据");

let yScale = d3.scale.linear()
    .domain([0, d3.max(bar_dataset)])
    .range([bar_height - padding.top - padding.bottom, 0]);

// 定义坐标轴
let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(bar_dataset.length); //ticks()：指定刻度的数量

let yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

let rect = bar_svg.selectAll("rect")
    .data(bar_dataset)
    .enter()
    .append("rect")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .attr("x", function (d, i) {
        return xScale(i) + paddingWidth / 2;
    })
    .attr("y", function (d) {
        return yScale(d);
    })
    .attr("fill", "orange")
    .transition()
    .delay(function (d, i) {
        return i * 200;
    })
    .duration(2000)
    .ease("bounce")
    .attr("y", function (d) {
        return yScale(d);
    })
    .attr("fill", "steelblue")
    .attr("width", xScale.rangeBand() - paddingWidth)
    .attr("height", function (d) {
        return bar_height - padding.top - padding.bottom - yScale(d);
    });

let text = bar_svg.selectAll("text")
    .data(bar_dataset)
    .enter()
    .append("text")
    .attr("fill", "white")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .attr("font-size", "14px")
    .attr("x", function (d, i) {
        return xScale(i) + paddingWidth;
    })
    .attr("y", function () {
        const min = yScale.domain()[0];
        return yScale(min);
    })
    .transition()
    .delay(function (d, i) {
        return i * 200;
    })
    .duration(2000)
    .ease("bounce")
    .attr("y", function (d) {
        return yScale(d);
    })
    .attr("text-anchor", "middle")
    .attr("dx", (xScale.rangeBand() - paddingWidth) / 2)
    .attr("dy", "1em")
    .text(function (d) {
        return d;
    });


bar_svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + (bar_height - padding.bottom) + ")")
    .call(xAxis);

bar_svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .call(yAxis);


// 该函数用于更新柱状图的分区数
function draw() {
    let updateRect = bar_svg.selectAll("rect")
        .data(bar_dataset);

    let enterRect = updateRect.enter();
    let exitRect = updateRect.exit();

    let updateText = bar_svg.selectAll("text")
        .data(bar_dataset);

    let enterText = updateText.enter();
    let exitText = updateText.exit();

    updateRect.attr("x", function (d, i) {
        return padding.left + i * rectStep;
    })
        .attr("y", function (d) {
            return height - d - padding.top;
        })
        .attr("fill", "steelblue")
        .attr("width", rectWidth)
        .attr("height", function (d) {
            return d;
        });

    enterRect.append("rect")
        .attr("x", function (d, i) {
            return xScale(i) + 5;
            // return padding.left + i * rectStep;
        })
        .attr("y", function (d) {
            return height - d - padding.top;
        })
        .attr("fill", "steelblue")
        .attr("width", rectWidth)
        .attr("height", function (d) {
            return d;
        });

    exitRect.remove();

    updateText.attr("fill", "white")
        .attr("font-size", "14px")
        .attr("x", function (d, i) {
            return padding.left + i * rectStep;
        })
        .attr("y", function (d) {
            return height - d - padding.top;
        })
        .attr("text-anchor", "middle")
        .attr("dx", rectWidth / 2)
        .attr("dy", "1em")
        .text(function (d) {
            return d;
        });

    enterText.append("text")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("x", function (d, i) {
            return padding.left + i * rectStep;
        })
        .attr("y", function (d) {
            return height - d - padding.top;
        })
        .attr("text-anchor", "middle")
        .attr("dx", rectWidth / 2)
        .attr("dy", "1em")
        .text(function (d) {
            return d;
        });

    exitText.remove();


}

// 该函数采取了不同的方式来更新矩阵和坐标轴，即将之前绘图全部擦掉，重绘
function drawAxis() {

    let gLabel = bar_svg.selectAll("g");
    gLabel.remove();

    let rectLabel = bar_svg.selectAll("rect");
    rectLabel.remove();

    let textLabel = bar_svg.selectAll("text");
    textLabel.remove();


    let xScale = d3.scale.ordinal()
        .domain(d3.range(0, bar_dataset.length))
        .rangeRoundBands([0, bar_width - padding.right - padding.left]);

    const yScale = d3.scale.linear()
        .domain([0, d3.max(bar_dataset)])
        .range([bar_height - padding.top - padding.bottom, 0]);

// 定义坐标轴
    const xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(bar_dataset.length); //ticks()：指定刻度的数量

    const yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");


    let rect = bar_svg.selectAll("rect")
        .data(bar_dataset)
        .enter()
        .append("rect")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("x", function (d, i) {
            return xScale(i) + paddingWidth / 2;
        })
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("fill", "orange")
        .transition()
        .delay(function (d, i) {
            return i * 200;
        })
        .duration(2000)
        .ease("bounce")
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("fill", "steelblue")
        .attr("width", xScale.rangeBand() - paddingWidth)
        .attr("height", function (d) {
            return bar_height - padding.top - padding.bottom - yScale(d);
        });

    let text = bar_svg.selectAll("text")
        .data(bar_dataset)
        .enter()
        .append("text")
        .attr("fill", "white")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .attr("font-size", "14px")
        .attr("x", function (d, i) {
            return xScale(i) + paddingWidth;
        })
        .attr("y", function () {
            const min = yScale.domain()[0];
            return yScale(min);
        })
        .transition()
        .delay(function (d, i) {
            return i * 200;
        })
        .duration(2000)
        .ease("bounce")
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("text-anchor", "middle")
        .attr("dx", (xScale.rangeBand() - paddingWidth) / 2)
        .attr("dy", "1em")
        .text(function (d) {
            return d;
        });

    bar_svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (bar_height - padding.bottom) + ")")
        .call(xAxis);

    bar_svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yAxis);
}

function sort() {
    bar_dataset.sort(d3.ascending);
    drawAxis();
    // draw();
}

function add() {
    bar_dataset.push(Math.floor(Math.random() * 100));
    drawAxis();
    // draw();
}