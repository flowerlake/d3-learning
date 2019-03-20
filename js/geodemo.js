const geo_width = 1000;
const geo_height = 800;

let geo_svg = d3.select("div#geodemo")
    .attr("align", "center")
    .append("svg")
    .attr("width", geo_width)
    .attr("height", geo_height)
    .append("g");

let geo_projection = d3.geo.mercator()
    // center设定地图的中心位置，107为经度、31为纬度
        .center([107, 31])
        .translate([geo_width / 2, geo_height / 2])
        .scale(750)
;


let geo_path = d3.geo.path()
    .projection(geo_projection);

d3.queue()
    .defer(d3.csv, "data/PieAndGeoData/data_pie.csv")
    .defer(d3.json, "data/PieAndGeoData/china.json")
    .defer(d3.json, "data/PieAndGeoData/data_scatter.json")
    .defer(d3.xml, "data/southchinasea.svg")
    .call(geo_draw);

function geo_draw(error, pie_data, china_data, scatter_data) {
    if (error) {
        return console.log(error);
    }

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// create geo map /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    geo_svg.selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", function (d, i) {
            return color(i)
        })
        //使用地理路径绘图,相当于这个
        //     .attr("d",funtion(d){
        //     return path(d);
        // })
        .attr("d", geo_path)
        .on("mouseover", function () {
            d3.select(this)
                .attr("fill", "yellow");
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .attr("fill", color(i));
        });

    $("#geodemo").children("svg").prepend(xml.getElementsByTagName("g")[0]);

    d3.select("#southchinasea")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("fill", "red")
        .attr("transform", "translate(" + (geo_width - 200) + "," + (geo_height - 300) + ")scale(0.8)");

}