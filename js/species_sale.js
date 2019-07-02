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
        console.log(newData);
        /*---------------------------------------------------------------------------------------*/

        var margin = { top: 20, right: 10, bottom: 100, left: 90 },
            width = 430 - margin.right - margin.left,
            height = 280 - margin.top - margin.bottom;


        var canvas = d3.select("#hello").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "species_sale")
        // .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(count)])
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
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(xAxis)
            .append("text")
            // .attr("transform", "rotate(90)")
            .attr("y", 5)
            .attr("dy", "-0.8em")
            .attr("text-anchor", "middle")
            .text("Count")

        var yg = canvas.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.5em")
            .attr("dy", "-0.55em")
            .attr("y", 10)
            .selectAll(".tick text")
        // .attr("transform", "rotate()")


        var rect = canvas.selectAll("rect")
            .data(newData)
            .enter()
            .append("rect")
            .attr("width", function (d) {
                return xScale(d.count)
            })
            .attr("y", function (d) {
                return yScale(d.species)
            })
            .attr("height", yScale.bandwidth())
            .attr("fill", "steelblue")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .on("mouseover", function () {
                tooltip.style("display", null);
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            })
            .on("mousemove", function (d) {
                var xPos = d3.mouse(this)[0] + 10;
                var yPos = d3.mouse(this)[1] - 20;
                tooltip.attr("transform", "translate(" + xPos + ", " + yPos + ")");
                tooltip.select("text").text(d.species + " : " + d.count);
            })


        var tooltip = canvas.append("g")
            .attr("class", "tooltip")
            .style("display", "none")

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("font-size", "1.25em")
            .attr("font-weight", "bold")





        // var margin = { top: 50, right: 20, left: 50, bottom: 20 },
        //     width = 600,
        //     height = 600;

        // var yScale = d3.scaleLinear()
        //     .domain([0, d3.max(count)])
        //     .range([width, 0]);

        // var yAxis = d3.axisLeft()
        //     .scale(yScale);

        // var xScale = d3.scaleBand()
        //     .range([0, width])
        //     .domain(newData.map((s) => s.language))
        //     .padding(0.4)


        // var canvas = d3.select("#hello").append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("class", "species_sale")
        //     .append("g");



        //     var rect = canvas.selectAll("rect")
        //     .data(newData)
        //     .enter()
        // .append("rect")
        // .attr("width", 50)
        // .attr("x", function (d, i) {
        //     return i * 75;
        // })
        // .attr("height", function (d) {
        //     return yScale(d.count);
        // })
        // .attr("y", function(d){
        //     return height - yScale(d.count);
        // })
        // .attr("fill", "steelblue")
        //     .attr("transform", "translate("+margin.left+","+margin.top+")");

        // canvas.append("g")
        //     .attr("transform", "translate("+margin.left+","+margin.top+")")
        //     .call(yAxis);

        // var myChart = new dimple.chart(svg, newData);
        // myChart.setBounds(60, 30, 510, 305);
        // var x = myChart.addCategoryAxis("y", "Hi");
        // myChart.addMeasureAxis("x", "Hello");
        // myChart.addSeries(null, dimple.plot.bar);
        // myChart.draw();
    })
}
