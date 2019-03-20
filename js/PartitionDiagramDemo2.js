const part_width2 = 960;
const part_height2 = 600;

let part_svg2 = d3.select("div#partition_diagram2").attr("align", "center")
    .append("svg")
    .attr("width", part_width2)
    .attr("height", part_height2);

let partition2 = d3.layout.partition()
    .sort(null)
    .size([2*Math.PI, 250*250])
    .value(function (d) {
        return 1;
    });

let arc_part = d3.svg.arc()
    .startAngle(function (d) {
        return d.x
    })
    .endAngle(function (d) {
        return d.x + d.dx
    })
    .innerRadius(function (d) {
        return Math.sqrt(d.y)
    })
    .outerRadius(function (d) {
        return Math.sqrt(d.y+d.dy)
    });

d3.json("data/city2.json", function (error, root) {
    if (error) console.log(error);

    console.log(root);
    let nodes_arc = partition2.nodes(root);
    let links_arc = partition2.nodes(root);

    console.log(nodes_arc);

/////////////////2、draw//////////////////////////
    let gSvg = part_svg2.selectAll("g")
        .data(nodes_arc)
        .enter()
        .append("g");

    let gArcs = gSvg.append("g")
        .attr("transform", "translate(" + part_width2 / 2 + "," + part_height2 / 2 + ")");

    gArcs.append("path")
        .attr("display",function (d) {
            return d.depth ? null : 'none';
        })
        .attr("d",arc_part)
        .style("stroke", "#fff")
        .attr("fill",function (d,i) {
            return part_color(i)
        });

    gArcs.append("text")
        .attr("class","partText2")
        .attr("dy", ".1em")
        //TODO: how to calculate this coordinate of text.
        .attr("transform",function (d,i) {
            if (i !== 0){
                let r = d.x + d.dx/2;

                let angle = Math.PI/2;
                r += r<Math.PI ? (angle *-1):angle;
                r*=180/Math.PI;
                console.log(arc_part.centroid(d));
                return "translate(" + arc_part.centroid(d) + ")" + "rotate(" + r + ")";
            }
        })
        .text(function (d) { return d.name });
});

