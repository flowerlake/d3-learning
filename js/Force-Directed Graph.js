const force_width = 600;
const force_height = 400;

let force_svg = d3.select("div#force_directed").attr("align", "center")
    .append("svg")
    .attr("width", force_width)
    .attr("height", force_height);

const force_dataset = {
    nodes: [//节点
        {name: "Adam"},
        {name: "Bob"},
        {name: "Carride"},
        {name: "Donovan"},
        {name: "Edward"},
        {name: "Felicity"},
        {name: "George"},
        {name: "Hannah"},
        {name: "Iris"},
        {name: "Jerry"}
    ],
    edges: [//边
        {source: 0, target: 1, weight: 1},
        {source: 0, target: 2, weight: 3},
        {source: 0, target: 3, weight: 4},
        {source: 0, target: 4, weight: 6},
        {source: 1, target: 5, weight: 3},
        {source: 2, target: 5, weight: 8},
        {source: 2, target: 5, weight: 7},
        {source: 3, target: 4, weight: 9},
        {source: 5, target: 8, weight: 1},
        {source: 5, target: 9, weight: 3},
        {source: 6, target: 7, weight: 4},
        {source: 7, target: 8, weight: 0},
        {source: 2, target: 8, weight: 8},
        {source: 3, target: 8, weight: 1},
        {source: 5, target: 8, weight: 5},
        {source: 6, target: 8, weight: 3},
        {source: 8, target: 9, weight: 4}
    ]
};

// 生成一个0-length的数组
let f = length => Array.from({length}, (v, k) => k);
renodes = f(force_dataset.nodes.length);

// 没有必要做这一步的转换，因为在d3默认将nodes数组中的节点做一个index
for (let i = 0; i < renodes.length; i++) {
    renodes[i] = {name: (renodes[i])};
}


// 2. 转换数据使用布局方法
// TODO: how to understand d3.layout.force() in the aspect of data transition.
// TODO: Google how to understand d3 layout then pick the YouTube video.

let force = d3.layout.force()
    .nodes(force_dataset.nodes)
    .links(force_dataset.edges)
    .size([force_width, height])
    .linkDistance(90)
    .charge(-400);

console.log(force);


// 开始布局计算
force.start();


// 3. 开始绘制，一个力导向图包含两个基本元素，一个是线、一个是边。
let lines = force_svg.selectAll(".forceLine")
// 这里的dataset.edges经过数据变化（layout）后，和最初定义的layout已经不一样了，layout为其增加了一些坐标等元素。
    .data(force_dataset.edges)
    .enter()
    .append("line")
    .attr("class", "forceLine")
    .attr("stroke-width", function (d) {
        return 5 * d.weight / 10;
    })
    .attr("stroke", "black");

// console.log(force_dataset.edges);

// const color = d3.scale.category20();

let circles = force_svg.selectAll(".forceCircle")
    .data(force_dataset.nodes)
    .enter()
    .append("circle")
    .attr("class", "forceCircle")
    .attr("r", 20)
    .style("fill", function (d, i) {
        return color(i);
    })
    // call函数的用法就是把call以上的所有参数传递给所调用的函数force.drag
    .call(force.drag);


// text的几个要素，位置、文字、
let texts = force_svg.selectAll("text")
    .data(force_dataset.nodes)
    .enter()
    .append("text")
    .text(function (d) {
        return d.name
    })
    .attr("class", "forceText")
    .attr("dy", ".3em");

// force.on("start",function () {
//     console.log("运动开始0");
// });

// force.on可为三种事件设定监听器，start、tick、end。其中start是刚开始运动，end是运动停止、tick是表示运动的每一步，即每一帧的动画图形元素的位置。
force.on("tick", function () {
    // 更新连线的端点坐标
    lines.attr("x1", function (d) {
        // 这里是对lines进行属性的绑定，因此这里的d为lines最初绑定的数据dataset.edges
        // console.log(d);
        return d.source.x;
    });
    lines.attr("y1", function (d) {
        return d.source.y
    });
    lines.attr("x2", function (d) {
        return d.target.x
    });
    lines.attr("y2", function (d) {
        return d.target.y
    });

    // 更新节点坐标
    circles.attr("cx", function (d) {
        // 这里是对circles进行属性的绑定，因此这里的d为circles最初绑定的数据renodes
        return d.x
    });
    circles.attr("cy", function (d) {
        return d.y
    });

    // 更新节点文字的坐标
    texts.attr("x", function (d) {
        return d.x
    });
    texts.attr("y", function (d) {
        return d.y
    });
});


// force.on("end",function () {
//     console.log("运动结束");
// });

// var drag = force.drag()
//             .on("dragstart",function (d) {
//                 d.fixed = true;
//             })
//             .on("dragend",function (d,i) {
//                 d3.select(this).style("fill",color(i));
//             })
//             .on("drag",function (d) {
//                 d3.select(this).style("fill","yellow")
//             })
//             .call(drag);