function importSpeciesSales() {
    d3.json("http://localhost:3000/species_sales").then(function (data) {
        /*
            Manipulating data:
            instead of 
            {
                "leatherback": 500
                "coral": 25
            }
            it is now
            {
                "species": "leatherback",
                "count": 500
            },
            {
                "species": "coral".
                "count": 25
            }
            for better data manipulation
        */
        var count = [], species = [];
        
        
        for (x in data) {
            count.push(data[x]);
            species.push(x);
        }
        

        var jsonString = multjsonparser(species, count, ["species", "count"]);
        var newData = toJson(jsonString);
        /*---------------------------------------------------------------------------------------*/
        var margin = { top: 20, right: 10, bottom: 100, left: 100 },
            width = 430 - margin.right - margin.left,
            height = 230 - margin.top - margin.bottom;

        var canvas = d3.select("#spcs_sales").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "species_sale")
            .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.right + ")");
        var xScale = d3.scaleLinear()
            .domain([0, Math.ceil(d3.max(count) / 100) * 100])
            .range([0, width]);

        var yScale = d3.scaleBand()
            .domain(species)
            .range([0, height + margin.bottom])
            .paddingInner(0.4)

        var xAxis = d3.axisTop()
            .scale(xScale);

        var yAxis = d3.axisLeft()
            .scale(yScale);

        var xg = canvas.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top - 1) + ")")
            .call(xAxis)
            .append("text")
            .attr("y", -10)
            .attr("x", -10)
            .attr("text-anchor", "end")
            .text("Count")

        var yg = canvas.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + (margin.left - 1) + ", " + margin.top + ")")
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.5em")
            .attr("dy", "-0.55em")
            .attr("y", 10)
            .selectAll(".tick text")
        canvas.append('g')
            .attr('class', 'grid')
            .attr("transform", "translate(" + (margin.left) + ", " + (margin.top - 1) + ")")
            .call(d3.axisBottom()
                .scale(xScale)
                .tickSize(height + margin.top + margin.bottom, 0, 0)
                .tickFormat(''))

        const bar = canvas.selectAll()
            .data(newData)
            .enter()
            .append("g")

        const rect = bar.append("rect")
            .attr("width", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return yScale(d.species);
            })
            .attr("height", yScale.bandwidth())
            .attr("fill", "rgb(255,255,102)")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            
        rect.transition()
            .duration(1000)
            .attr("width", function (d) {
                return xScale(d.count);
            })
            .on("end", function () {
                rect.on("mouseover", function (actual, i) {
                    d3.selectAll(".value")
                        .attr("visibility", "hidden")

                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr("y", (a) => yScale(a.species) - 2)
                        .style("fill", "rgb(255,255,150)")
                        .attr("height", yScale.bandwidth() + 4)
                        .attr("opacity", 0.7);

                    const x = xScale(actual.count)
                    var line = canvas.append("line")
                        .attr("id", "limit")
                        .attr("x1", margin.left + x)
                        .attr("x2", margin.left + x)
                        .attr("y1", margin.top + 0)
                        .attr("y2", margin.top + margin.bottom + height)
                        .attr("stroke", "red")

                    var diff = bar.append('text')
                        .attr('class', 'divergence')
                        .attr("y", (a) => margin.top + yScale(a.species) + yScale.bandwidth() - 5)
                        .attr("x", (a) => margin.left + xScale(a.count) - 4)
                        .attr('text-anchor', 'end')
                        .attr("fill", function (a) {
                            const divergence = (a.count - actual.count).toFixed()
                            if (divergence > 0) return "green"
                            else return "red"
                        })
                        .text((a, idx) => {
                            const divergence = (a.count - actual.count).toFixed()
                            let text = ''
                            if (divergence > 0) text += '+'
                            text += `${divergence}`
                            return idx !== i ? text : '';
                        })


                })
                    .on("mouseout", function () {
                        d3.selectAll(".value")
                            .attr("visibility", "visible")

                        d3.select(this)
                            .transition()
                            .duration(300)
                            .style("fill", "rgb(255,255,102)")
                            .attr("y", (a) => yScale(a.species))
                            .attr("height", yScale.bandwidth())
                            .attr("opacity", 1);

                        canvas.selectAll("#limit").remove()
                        canvas.selectAll(".divergence").remove()
                    })
            })


        const tooltip = bar.append("text")
            .attr("class", "value")
            .attr("text-anchor", "end")
            .attr("fill", "#2884cf")
            .attr("y", (a) => margin.top + yScale(a.species) + yScale.bandwidth() - 5)
            .attr("x", (a) => margin.left + 22)
            .text((a) => a.count)


        tooltip.transition()
            .duration(1050)
            .attr("fill", "gray")
            .attr("transform", function (d) {
                return "translate(" + (xScale(d.count) - 25) + "," + 0 + ")";
            })
    })
}
