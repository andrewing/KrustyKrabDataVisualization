function importBurgerBySpecies() {
    var burgerSalesData;
    var burgerBySpeciesData;
    d3.json("http://localhost:3000/burger_sales").then(function (data) {

        var count = [], burger = [], all = ["All"];
        for (x in data) {
            count.push(data[x]);
            burger.push(x);
        }
        burgerSalesData = data;
        /*********************************************************************/
        var margin = { top: 10, left: 25, right: 50, bottom: 10 },
            width = 200 - margin.left - margin.right,
            height = 230 - margin.top - margin.bottom;

        var canvas = d3.select("#hello").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "species_sale_percentage")
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var xScale = d3.scaleBand()
            .domain(all)
            .range([0, width - margin.left - margin.right])
            .paddingInner([0.2])

        // var xAxis = d3.axisBottom()
        //     .scale(xScale)

        // var xg = canvas.append("g")
        //     .attr("transform", "translate(" + margin.left + ", " + (height - margin.top) + ")")
        //     .call(xAxis);

        var yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margin.top - margin.bottom, 0])

        var yAxis = d3.axisLeft()
            .scale(yScale)
            .tickFormat(d3.format(".0%"))

        var yg = canvas.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(yAxis)

        var color = d3.scaleOrdinal()
            .domain(burger)
            .range(['rgb(251, 128, 114)', 'rgb(128, 177, 211)', 'rgb(179, 222, 105)', 'rgb(253, 180, 98)'])

        var total = 0;
        for (var i = 0; i < burger.length; i++) {
            total += burgerSalesData[burger[i]];
        }
        for (var i = 0; i < burger.length; i++) {
            burgerSalesData[burger[i]] = burgerSalesData[burger[i]] / total * 1;
        }

        burgerSalesData = [burgerSalesData];
        var stackedData = d3.stack()
            .keys(burger)
            (burgerSalesData)
        canvas.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", function (d) { return color(d.key) })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("y", function (d) { return yScale(d[1]) + margin.top; })
            .attr("x", margin.left + 15)
            .attr("height", function (d) { return yScale(d[0]) - yScale(d[1]); })
            .attr("width", xScale.bandwidth())
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("opacity", 0.7)
                    .attr("x", xScale.bandwidth() - 5)
                    .attr("width", xScale.bandwidth() + 10)
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("opacity", 1)
                    .attr("x", xScale.bandwidth())
                    .attr("width", xScale.bandwidth())
            })


        var legend = canvas.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + ((height - 18) - (i * 20)) + ")"; });

        legend.append("rect")
            .attr("x", width - margin.right + 15)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - margin.right + 35)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("font-size", 10)
            .style("text-anchor", "start")
            .text(function (d) { return d; });


    })


    d3.json("http://localhost:3000/burger_by_species").then(function (data) {
        importBurgerBySpecies = data;

        var margin = { top: 20, right: 20, left: 20, bottom: 20 },
            width = 470 - margin.right - margin.left,
            height = 230 - margin.top - margin.bottom;

        var canvas = d3.select("#hello").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "species_sale_bar")
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


    })

}