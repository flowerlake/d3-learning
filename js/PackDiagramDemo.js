const packWidth = 960;
const packHeight = 600;

let pack_svg = d3.select("div#pack_diagram").attr("align", "center")
    .append("svg")
    .attr("width", packWidth)
    .attr("height", packHeight);

////////////////1、add layout//////////////////

// Regardless of the layout used, after converting the data, you must first enter it
// into the console, observe the data format, and then decide how to use it to add graphic elements.
let pack = d3.layout.pack()
    .size([packWidth, packHeight])
    .padding(30)
    .radius(6);

d3.json("data/city2.json", function (error, root) {
    let pack_nodes = pack.nodes(root);
    let pack_links = pack.links(pack_nodes);

    console.log(pack_nodes);
    console.log(pack_links);

////////////////2、draw//////////////////

    //there are three attributions for circle label, such as cx,cy,r
    pack_svg.selectAll("circle")
        .data(pack_nodes)
        .enter()
        .append("circle")
        // .attr("class", function (d) {
        //     return d.children ? "node" : "leafnode";
        // })
        .attr("fill", "rgb(31, 119, 180)")
        .attr("fill-opacity", "0.4")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r;
        });

    // there are six attributions for text label, such as x,y,dx,dy,textLength,rotate
    pack_svg.selectAll("text")
        .data(pack_nodes)
        .enter()
        .append("text")
        .attr("class", "nodeText")
        //Decide whether to display text by controlling the style:fill-opacity
        .style("fill-opacity", function (d) {
            return d.children ? 0 : 1;
        })
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .text(function (d) {
            return d.name;
        });
});