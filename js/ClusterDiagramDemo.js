const clusterWidth = 960;
const clusterHeight = 600;

let cluster_svg = d3.select("div#cluster_diagram").attr("align", "center")
    .append("svg")
    .attr("width", clusterWidth)
    .attr("height", clusterHeight);