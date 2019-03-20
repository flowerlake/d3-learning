var w = 1000;
var h = 1000;
var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(100,50)");
var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(800)
    .translate([w / 2, h / 2]);//移动投影起始点
var path = d3.geo.path()
    .projection(projection);

var color = d3.scale.log()
    .range(["#DFFFDF", "#008000"]);
d3.csv("provincedata1.csv", function (data) {
    color.domain([
        d3.min(data, function (d) {
            return d.value;
        }),
        d3.max(data, function (d) {
            return d.value;
        })
    ]);

    d3.json("china-demo.json", function (error, json) {

        for (var i = 0; i < data.length; i++) {//找父对象中的data

            var dataState = parseInt(data[i].id);		//Grab state name
            var dataValue = parseInt(data[i].value);	//Grab data value, and convert from string to float
            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

                var jsonState = parseInt(json.features[j].properties.id);

                if (dataState == jsonState) {

                    //Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;

                    //Stop looking through the JSON
                    break;

                }
            }
        }

        if (error)
            return console.error(error);
        console.log(json.features);

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("d", path)
            .attr("fill", function (d) {
                //Get data value
                var value = d.properties.value;//就是那个值
                if (value) {
                    //If value exists…
                    console.log(value + "->" + color(value));

                    return color(value);
                } else {
                    //If value is undefined…
                    return "#ccc";
                }
            });

        //add pie chart
        //var colorPie = d3.scale.quantize()
        var colorPie = d3.scale.quantize()
            .range(["#FF0000", "#0BFFFF", "#FFFF0B", "#FFBFFF", "#0BFF0B", "#AA55FF", "#FF8000"])
            //.range(["#FF0000","#0BFFFF","#FFFF0B","#FFBFFF","#0BFF0B","#AA55FF","#FF8000"])
            .domain([0, 7]);
        piedata = new Array();//新建饼图数据存储器
        //var outerRadius = 17;//radius of pie
        var innerRadius = 0;
        var arc = d3.svg.arc()  //arc为圆弧生成器方法
            .innerRadius(innerRadius);

        d3.csv("pie_data1.csv", function (data) {

            //准备饼图数据到piedata
            for (var i = 0; i < data.length; i++) {
                svg.append("g")//对每一个饼图添加一个g元素，并编号id
                    .attr("id", function () {
                        return data[i].rank;
                    });//给g元素添加了id,但是该案例中没用

                piedataRow = new Array();
                var j = 0;
                piedataRow[j++] = data[i].a;
                piedataRow[j++] = data[i].b;
                piedataRow[j++] = data[i].c;
                piedataRow[j++] = data[i].d;
                piedataRow[j++] = data[i].e;
                piedataRow[j++] = data[i].f;
                piedataRow[j++] = data[i].g;

                piedata[i] = piedataRow;
            }

            for (var i = 0; i < data.length; i++) {

                var d = data[i];
                var cx = projection([d.lon, d.lat])[0];
                var cy = projection([d.lon, d.lat])[1];
                //console.log(cx);
                var rank = data[i].rank;
                var pie = d3.layout.pie();

                var gPie = svg.append("g")
                    .attr("transform", "translate(" + cx + "," + cy + ")");//gpei这个g元素的位置确定

                //gpie为g元素  投影到cx,cy

                //pie是一个函数，将data转换为饼图 而不需要计算角度
                var b = data[i].r;
                setouterRadius = function (a) {
                    a = parseFloat(a);
                    if (a < 11) {
                        return 11;
                    }
                    else {
                        return a;
                    }
                };//半径时用的
                outerRadius = setouterRadius(b);
                arc = arc.outerRadius(outerRadius);
                //set groups
                var arcs = gPie.selectAll("g.arc")//g元素上加弧元素
                    .data(pie(piedata[i]))//使用了pie函数
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
                //translate(a,b)  a表示横坐标起点，b表示纵坐标起点   也就是移动起始点位置到（a,b）

                //Draw arc paths
                arcs.append("path")   //arcs is 5 g element,add path to g element
                    .attr("fill", function (d, i) {
                        return colorPie(i);
                    })
                    .attr("d", arc)
                    .style("opacity", 0.8);

                //text  number
                arcs.append("text")
                    .attr("transform", function (d) {
                        return "translate(" + arc.centroid(d) + ")";//find the centroid of arc 计算每个弧形的中心点（几何中心）
                    })
                    .attr("text-anchor", "middle")  //  text position
                    .attr("font-size", "8px")
                    .text(function (d, i) {//会i为1到7返回过来
                        if (parseInt(d.value) != 0) {
                            return d.value;
                        }
                        else {
                            return null;
                        }

                    });
            }

        });
    });
});