var width = 400;
var height = 400;

// 1. 确定数据
var pie_dataset = [["小米", 60.8], ["三星", 58.4], ["联想", 47.3], ["苹果", 46.6], ["华为", 41.3], ["酷派", 40.1], ["其他", 111.5]];

var svg = d3.select("div#pie").attr("align", "center")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// 2. 转换数据，这里传递给layout的值为dataset中的数值数据，也即是绘制饼图所必要的唯一的数据，即每一个扇区所能代表的大小。
var pie = d3.layout.pie()
    .value(function (d) {
        return d[1];
    });
console.log(pie(pie_dataset));

// 3. 绘制饼图，通过弧生成器d3.svg.arc()函数来绘制饼图
var arcPath = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(width / 3);

var arcPath2 = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(width / 3 + 10);

var color = d3.scale.category20();

var arcPaths = svg.selectAll("g")
    .data(pie(pie_dataset))
    .enter()
    .append("g")
    .attr("id", "pie")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

arcPaths.append("path")
    .attr("d", function (d) {
        // console.log(arcPath(d));
        // arc(d)得到的是path 的几个坐标点
        return arcPath(d);
    })
    .attr("fill", function (d, i) {
        return color(i);
    });

// 添加弧内的文字,绘制文字的几个要素，文字的方向样式，坐标，以及文字本身的内容（TEXT）
arcPaths.append("text")
    .attr("text-anchor", "middle")
    .text(function (d, i) {
        // 这个函数用来计算百分比，这里注意传过来的d已经不是dataset了，而是pie(pie_dataset)
        var percent = 100 * Number(d.value) / d3.sum(pie_dataset, function (d) {
            return d[1];
        });
        return percent.toFixed(1) + "%";
    })
    .attr("transform", function (d) {
        // 弧中心坐标是arc.centroid(d)，弧边缘的中心坐标可以用arc.centroid(d)乘以一个系数的方法可以获取圆心和弧中心所在直线上的任意点。
        var x = arcPath.centroid(d)[0] * 1.4;
        var y = arcPath.centroid(d)[1] * 1.4;
        return "translate(" + x + "," + y + ")";
    });

arcPaths.append("line")
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .attr("x1", function (d) {
        return arcPath.centroid(d)[0] * 2
    })
    .attr("y1", function (d) {
        return arcPath.centroid(d)[1] * 2
    })
    .attr("x2", function (d) {
        return arcPath.centroid(d)[0] * 2.2
    })
    .attr("y2", function (d) {
        return arcPath.centroid(d)[1] * 2.2
    });

arcPaths.append("text")
    .attr("transform", function (d) {
        return "translate(" + arcPath.centroid(d)[0] * 2.4 + "," + arcPath.centroid(d)[1] * 2.4 + ")";
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d.data[0];
    });

// 将饼图线性平滑向外移动的动画
// 其中ease控制动画的方式 linear：普通的线性变化，circle：慢慢地到达变换的最终状态，elastic：带有弹跳的到达最终状态， bounce：在最终状态处弹跳几次
arcPaths.select("path")
    .on("mouseover", function (d, i) {
        d3.select(this)
            .transition()
            .duration(200)
            .ease("linear")
            .attr("transform", function (d, i) {
                var midAngle = (d.startAngle + d.endAngle) / 2;
                return "translate(" + (20 * Math.sin(midAngle)) + "," + (-20 * Math.cos(midAngle)) + ")";
            })
            // 这里写了一个arcPath2，将outerRadius变大。即扩大外半径
            .attr("d", function (d) {
                return arcPath2(d);
            })
    })
    .on("mouseout", function (d, i) {
        d3.select(this)
            .transition()
            .duration(200)
            .ease("linear")
            .attr("transform", function (d, i) {
                var midAngle = (d.startAngle + d.endAngle) / 2;
                return "translate(" + (1 * Math.sin(midAngle)) + "," + (-1 * Math.cos(midAngle)) + ")";
                return "translate(0)";
            })
            .attr("d", function (d) {
                return arcPath(d);
            })
    })

