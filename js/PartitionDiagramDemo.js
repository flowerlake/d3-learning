const part_width = 1900;
const part_height = 600;

let part_svg = d3.select("div#partition_diagram1").attr("align", "center")
    .append("svg")
    .attr("width", part_width)
    .attr("height", part_height);

let partition = d3.layout.partition()
    .sort(null)
    .size([part_width, part_height])
    .value(function (d) {
        return 1;
    });

let part_color = d3.scale.category20();

d3.json("data/city2.json", function (error, root) {
    if (error) console.log(error);

    console.log(root);
    let nodes_part = partition.nodes(root);
    let links_part = partition.nodes(root);

    console.log(nodes_part);

/////////////////2、draw//////////////////////////
    let gPart = part_svg.selectAll("g")
        .data(nodes_part)
        .enter()
        .append("g");

    gPart.append("rect")
        .attr("x",function (d) { return d.x })
        .attr("y",function (d) { return d.y })
        .attr("width",function (d) { return d.dx })
        .attr("height",function (d) { return d.dy })
        .style("stroke", "#fff")
        .attr("fill",function (d,i) {
            return part_color(i)
        });

    gPart.append("text")
        .attr("class","partText")
        .attr("x",function (d) { return d.x })
        .attr("y",function (d) { return d.y })
        .attr("dx", 20)
        .attr("dy", 20)
        .text(function (d) { return d.name });

});

