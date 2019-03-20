// URL: https://beta.observablehq.com/@mbostock/d3-force-directed-graph
// Title: D3 Force-Directed Graph
// Author: Mike Bostock (@mbostock)
// Version: 129
// Runtime version: 1

const m0 = {
    id: "a6c00de7c09bdfa1@129",
    variables: [
        {
            inputs: ["md"],
            value: (function (md) {
                return (
                    md`# D3 Force-Directed Graph

This network of character co-occurence in _Les Misérables_ is positioned by simulated forces using [d3-force](https://github.com/d3/d3-force). See also a [disconnected graph](/@mbostock/disjoint-force-directed-graph), and compare to [WebCoLa](/@mbostock/hello-cola).`
                )
            })
        },
        {
            name: "chart",
            inputs: ["data", "d3", "width", "height", "DOM", "color", "drag", "invalidation"],
            value: (function (data, d3, width, height, DOM, color, drag, invalidation) {
                    const links = data.links.map(d => Object.create(d));
                    const nodes = data.nodes.map(d => Object.create(d));

                    const simulation = d3.forceSimulation(nodes)
                        .force("link", d3.forceLink(links).id(d => d.id))
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter(width / 2, height / 2));

                    const svg = d3.select(DOM.svg(width, height));

                    const link = svg.append("g")
                        .attr("stroke", "#999")
                        .attr("stroke-opacity", 0.6)
                        .selectAll("line")
                        .data(links)
                        .enter().append("line")
                        .attr("stroke-width", d => Math.sqrt(d.value));

                    const node = svg.append("g")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1.5)
                        .selectAll("circle")
                        .data(nodes)
                        .enter().append("circle")
                        .attr("r", 5)
                        .attr("fill", color)
                        .call(drag(simulation));

                    node.append("title")
                        .text(d => d.id);

                    simulation.on("tick", () => {
                        link
                            .attr("x1", d => d.source.x)
                            .attr("y1", d => d.source.y)
                            .attr("x2", d => d.target.x)
                            .attr("y2", d => d.target.y);

                        node
                            .attr("cx", d => d.x)
                            .attr("cy", d => d.y);
                    });

                    invalidation.then(() => simulation.stop());

                    return svg.node();
                }
            )
        },
        {
            name: "data",
            inputs: ["d3"],
            value: (function (d3) {
                return (
                    d3.json("https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json")
                )
            })
        },
        {
            name: "height",
            value: (function () {
                return (
                    600
                )
            })
        },
        {
            name: "color",
            inputs: ["d3"],
            value: (function (d3) {
                    const scale = d3.scaleOrdinal(d3.schemeCategory10);
                    return d => scale(d.group);
                }
            )
        },
        {
            name: "drag",
            inputs: ["d3"],
            value: (function (d3) {
                return (
                    simulation => {

                        function dragstarted(d) {
                            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                            d.fx = d.x;
                            d.fy = d.y;
                        }

                        function dragged(d) {
                            d.fx = d3.event.x;
                            d.fy = d3.event.y;
                        }

                        function dragended(d) {
                            if (!d3.event.active) simulation.alphaTarget(0);
                            d.fx = null;
                            d.fy = null;
                        }

                        return d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended);
                    }
                )
            })
        },
        {
            name: "d3",
            inputs: ["require"],
            value: (function (require) {
                return (
                    require("d3@5")
                )
            })
        }
    ]
};
