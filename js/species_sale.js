function importSpeciesSales() {
    var svg = dimple.newSvg("#hello", 590, 400);

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
        //     .append("rect")
        //     .attr("width", 50)
        //     .attr("x", function (d, i) {
        //         return i * 75;
        //     })
        //     .attr("height", function (d) {
        //         return yScale(d.count);
        //     })
        //     .attr("y", function(d){
        //         return height - yScale(d.count);
        //     })
        //     .attr("fill", "steelblue")
        //     .attr("transform", "translate("+margin.left+","+margin.top+")");

        // canvas.append("g")
        //     .attr("transform", "translate("+margin.left+","+margin.top+")")
        //     .call(yAxis);

        var myChart = new dimple.chart(svg, newData);
        myChart.setBounds(60, 30, 510, 305);
        var x = myChart.addCategoryAxis("x", "Hi");
        myChart.addMeasureAxis("y", "Hello");
        myChart.addSeries(null, dimple.plot.bar);
        myChart.draw();
    })
}
