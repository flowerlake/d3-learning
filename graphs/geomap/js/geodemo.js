//version: d3.v4.js，是为了用d3.queue()方法
// author： GaoYang
'use static'

const geo_width = 1000;
const geo_height = 800;

let geo_svg = d3.select("div#geodemo")
    .attr("align", "center")
    .append("svg")
    .attr("width", geo_width)
    .attr("height", geo_height)
;

//queue 通过可配置的并发来执行 0 个或多个延迟的异步任务: 你可以控制同时进行多少个任务。当所有的任务完成或其中一个出错时候，
// 队列会将结果传递给 await 回调。
//https://github.com/xswei/d3-queue
d3.queue()
    .defer(d3.csv, "data/PieAndGeoData/data_pie.csv")
    //这个China.json数据格式不一致，在后面处理的有困难
    .defer(d3.json, "data/PieAndGeoData/china.json")
    .defer(d3.json, "data/PieAndGeoData/data_scatter.json")
    .defer(d3.xml, "data/southchinasea.svg")
    .await(geo_draw);


function geo_draw(error, pie_data, china_data, scatter_data, sea_xml) {

    if (error) {
        return console.log(error);
    }

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// Prepare Data /// /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    let pie_data_v2 = {};
    pie_data.forEach(function (d, i) {
        pie_data_v2[d.name] = [d.one, d.two, d.three];
    });

    let cities = [];
    cities = china_data.features.map(function (d, i) {
        return d["properties"]["name"];
    });

    let color1 = d3.schemeCategory20;
    let color2 = d3.schemeCategory20c;

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// create geo map /////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //这里直接创建两个group，分别添加g标签的时候，添加不出来
    let geo = geo_svg.selectAll("g")
        .data([1, 2])
        .enter()
        .append("g")
        .attr("id", function (d, i) {
            return (i ? "pie" : "map");
        });

    let geo_map = d3.select("g#map");

    let geo_projection = d3.geoMercator()
    // center设定地图的中心位置，107为经度、31为纬度
        .center([107, 31])
        .translate([geo_width / 2, geo_height / 2])
        .scale(750);

    // 是用来计算点的投影坐标将其转化为一组路径值
    let geo_path = d3.geoPath()
        .projection(geo_projection);

    geo_map.selectAll("path")
        .data(china_data.features)
        .enter()
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", function (d, i) {
            return color1[i] || color2[i - 20];
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
                .attr("fill", color1[i] || color2[i - 20]);
        });

    //添加南海地图
    $("#geodemo").children("svg").prepend(sea_xml.getElementsByTagName("g")[0]);

    d3.select("#southchinasea")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("fill", "red")
        .attr("transform", "translate(" + (geo_width - 200) + "," + (geo_height - 300) + ")scale(0.8)");

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// create pie ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////


    // 这里开始创建饼图，选择前面创建的group
    let geo_pie_layout = d3.pie()
        .sort(null)
        .value(function (d) {
            return d;
        });

    let geo_arcPath = d3.arc()
        .innerRadius(0)
        .outerRadius(14);

    let geo_pie = geo_svg.select("g#pie");

    // console.log(china_data);
    // console.log(china_data.features[0]["geometry"]["coordinates"][0][0]);
    let arcPaths = geo_pie.selectAll("g")
        .data(cities)
        .enter()
        .append("g")
        .attr("id", function (d, i) {
            return "pie" + String(i);
        })
        .attr("transform", function (d, i) {
            // 这里是为了计算饼图的坐标，求所有点的坐标平均值作为饼图的中心
            //sum 为计算坐标点的和的函数，求和的5种方法https://blog.csdn.net/YANG_Gang2017/article/details/72571505
            let sum1 = (arr) => [].concat(arr).reduce((acc, val) => acc + val[0], 0);
            console.log(china_data.features[i]["properties"]["name"]);
            let x = sum1(china_data.features[i]["geometry"]["coordinates"][0]) / china_data.features[i]["geometry"]["coordinates"][0].length;
            let sum2 = (arr) => [].concat(arr).reduce((acc, val) => acc + val[1], 0);
            let y = sum2(china_data.features[i]["geometry"]["coordinates"][0]) / china_data.features[i]["geometry"]["coordinates"][0].length;
            // 根据geo_projection得到一组坐标点在屏幕上的位置
            let cx = geo_projection([x, y])[0];
            let cy = geo_projection([x, y])[1];
            console.log(cx, cy);
            return "translate(" + (cx) + "," + (cy) + ")";
        });


    arcPaths.selectAll("path")
    //选择不同省市的数据，有些省市数据没有，catch error赋值[0,0,0]
        .data(function (d, i) {
            try {
                return geo_pie_layout(pie_data_v2[cities[i]]);
            } catch (e) {
                return geo_pie_layout([0, 0, 0])
            }
        })
        .enter()
        .append("path")
        .attr("d", function (d) {
            // arc(d)得到的是path 的几个坐标点
            return geo_arcPath(d);
        })
        .attr("fill", function (d, i) {
            return color1[i];
        });
}