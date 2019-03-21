const clusterWidth = 960;
const clusterHeight = 600;

let cluster_svg = d3.select("div#cluster_diagram").attr("align", "center")
    .append("svg")
    .attr("width", clusterWidth)
    .attr("height", clusterHeight);

let cluster = d3.layout.cluster()
    .size([360, clusterWidth / 2 - 100])
    // Set or get the interval between adjacent nodes
    .separation(function (a, b) {
        return (a.parent === b.parent ? 1 : 2) / a.depth;
    });

//////////////////////2. 绘制///////////////////////////////
let diagonal = d3.svg.diagonal.radial()
    .projection(function (d) {
        let radius = d.y,
            angel = d.x / 180 * Math.PI;

        return [radius, angel];
    });

d3.json("data/city2.json", function (error, root) {
    let cluster_nodes = pack.nodes(root);
    let cluster_links = pack.links(cluster_nodes);

    console.log(cluster_nodes);
    console.log(cluster_links);

    let cluster_link = cluster_svg.selectAll(".link")
        .data(cluster_links)
        .enter()
        .append("path")
        .attr("class","link")
        .attr("d",diagonal);
});