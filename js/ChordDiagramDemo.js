const chord_width = 960;
const chord_height = 600;

let chord_svg = d3.select("div#chord_diagram").attr("align", "center")
    .append("svg")
    .attr("width", chord_width)
    .attr("height", chord_height);

//the source data of chord diagram is a matrix，which represents chord diagram's ArcWidth.
const continent = ["亚洲", "欧洲", "非洲", "美洲", "大洋洲"];
// population matrix represents source of population,such as the number from country A to country B
const population = [
    [9000, 870, 3000, 1000, 5200],
    [3400, 8000, 2300, 4922, 374],
    [2000, 2000, 7700, 4881, 1050],
    [3000, 8012, 5531, 500, 400,],
    [3540, 4310, 1500, 1900, 300]
];

const chord = d3.layout.chord()
    .padding(0.03)
    .sortSubgroups(d3.ascending)
    .matrix(population);

//once we see startAngle and endAngle,we‘d better think of d3.avg.arc to draw arc.
console.log(chord.groups());

////////////////3、绘制//////////////////
//chord diagram的g元素，可以看到下面涉及到好几层的g元素，这就是组合图的基本原理
let gChord = chord_svg.append("g")
    .attr("transform", "translate(" + chord_width / 2 + "," + chord_height / 2 + ")");

// 节点的g元素，
let gOuter = gChord.append("g");

//弦的g元素
let gInner = gChord.append("g");

const chordColor = d3.scale.category20();

// 绘制节点
const innerRadius = chord_width / 2 * 0.4;
const outerRadius = innerRadius * 1.1;

//弧生成器
let chordArcOuter = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

gOuter.selectAll(".outerPath")
    .data(chord.groups)
    .enter()
    .append("path")
    .attr("class", "outerPath")
    .style("fill", function (d) {
        return chordColor(d.index);
    })
    // d -- one attribution of path，which includes point-to-point coordinates and the ways of movement.
    .attr("d", chordArcOuter);

// 创建弦生成器, 绘制
const arcInner = d3.svg.chord()
    .radius(innerRadius);

gInner.selectAll(".innerPath")
    .data(chord.chords())
    .enter()
    .append("path")
    .attr("class", "innerPath")
    .style("fill", function (d) {
        return chordColor(d.source.index);
    })
    .attr("d", arcInner);
