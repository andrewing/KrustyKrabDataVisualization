var update;
var reset;

function importBurgerBySpecies() {
    var burgerSalesData;
    var burgerBySpeciesData;
    var initialBurger;

    d3.json("http://localhost:3000/burger_sales").then(function (data) {

        var count = [], burger = [];
        for (x in data) {
            count.push(data[x]);
            burger.push(x);
        }

        draw();
        burgerSalesData = data;

        /*********************************************************************/
        var margin = { top: 10, left: 25, right: 50, bottom: 10 },
            width = 200 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var canvas = d3.select("#burgerBySpecies_percent").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "species_sale_percentage")
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


        var xScale = d3.scaleBand()
            .domain(["All"])
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

        // var yAxis = d3.axisLeft()
        //     .scale(yScale)
        //     .tickFormat(d3.format(".0%"))

        // var yg = canvas.append("g")
        //     .attr("class", "yAxis")
        //     .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
        //     .call(yAxis)

        var color = d3.scaleOrdinal()
            .domain(burger)
            .range(['violet', '#FFDB58', 'turquoise'])

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
            .on("mouseover", function (d) {
                update(d.key);
            })
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
                    .attr("width", xScale.bandwidth() + 10);

                

            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("opacity", 1)
                    .attr("x", xScale.bandwidth())
                    .attr("width", xScale.bandwidth())
                reset()
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


}


function draw() {
    var margin = { top: 20, right: 20, left: 20, bottom: 20 },
        width = 470 - margin.right - margin.left,
        height = 200 - margin.top - margin.bottom;

    var x0Scale = d3.scaleBand()
        .range([0, width])
        .round([0.1])
        .paddingInner([0.2]);
    var x1Scale = d3.scaleBand();

    var yScale = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x0Scale)
        .tickSize(0)

    var yAxis = d3.axisLeft()
        .scale(yScale)

    var color = d3.scaleOrdinal()
        .range(['violet', 'turquoise', '#FFDB58', 'rgb(253, 180, 98)']);

    var canvas = d3.select('#burgerBySpecies_bar').append("svg")
        .attr("class", "canvas")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("http://localhost:3000/burger_by_species").then(function (data) {

        // {
        //     "species": "coral"
        //     "sales":[
        //         {
        //             "burger": "Krabby Pattie",
        //             "count": 200
        //         },
        //         {
        //             "burger": "Krabby Deluxe",
        //             "count": 200;

        //         }
        //     ]
        // }
        var simplified = [], species = [], burgerNames = [], count = [];
        for (x in data) {
            for (y in data[x]) {
                var single = [];
                single.burger = x;
                if (!burgerNames.includes(x)) {
                    burgerNames.push(x);
                }
                count.push(data[x][y]);
                single.species = y;
                single.count = data[x][y];
                simplified.push(single);
            }
        }

        for (x in data) {
            for (y in data[x]) {
                if (!species.includes(y)) {
                    species.push(y);
                }
            }
        }

      


        var singleJSON;
        var dataJSON = []
        for (x in species) {
            singleJSON = { species: species[x], sales: [] }
            dataJSON.push(singleJSON)
        }


        for (x in dataJSON) {
            for (y in simplified) {
                if (simplified[y].species == dataJSON[x].species) {
                    dataJSON[x].sales.push({ burger: simplified[y].burger, count: simplified[y].count });
                }
            }
        }

       console.log(dataJSON);
        // var burgerNames = [], species = [], count = []
        // var salesJSON = [], burgerNamesJSON = [], dataJSONSing, dataJSON = [];
        // for (x in data) {
        //     for(y in data[x]){
        //         if(!species.includes(y)){
        //             species.push(y);
        //         }
        //     }
        // }

        // for (x in data) {
        //     burgerNames.push(x);
        //     var currCount = []
        //     for (y in data[x]) {
        //         currCount.push(data[x][y]);
        //         count.push(data[x][y]);
        //     }
        //     var jsonString = multjsonparser(species, currCount, ["species", "count"]);
        //     var newData = toJson(jsonString);  
        //     salesJSON.sales = newData;

        //     dataJSONSing = {burger: x, sales: newData};
        //     dataJSON.push(dataJSONSing);
        // } 


        x0Scale.domain(species);
        x1Scale.domain(burgerNames)
            .range([0, x0Scale.bandwidth()])
        yScale.domain([0, Math.ceil(d3.max(count) / 50) * 50])
        


        canvas.append("g")
            .attr("class", "grid")
            .call(d3.axisRight()
                .scale(yScale)
                .tickSize(width + margin.right, 0, 0)
                .tickFormat(''))
            .attr("transform", "translate(" + (margin.left - 5) + ", " + 0 + ")")


        // canvas.append("g")
        //     .attr("class", "grid")
        //     .call(d3.axisTop()
        //         .scale(x1Scale)
        //         .tickSize(height + margin.top + margin.bottom, 0, 0)
        //         .tickFormat(''))
        //     .attr("transform", "translate(" + (margin.left) + ", " + (margin.top - 1) + ")")


        canvas.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(xAxis);

        canvas.append("g")
            .attr("class", "yAxis")
            .style('opacity', '0')
            .attr("transform", "translate(" + (margin.left - 5) + ", " + 0 + ")")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Count");

        canvas.select('.yAxis')
            .transition()
            .duration(500)
            .delay(1300).
            style('opacity', '1');

        var slice = canvas.selectAll(".slice")
            .data(dataJSON)
            .enter().append("g")
            .attr("class", "slice")
            .attr("transform", function (d) { return "translate(" + x0Scale(d.species) + ",0)"; });

        var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("visibility", "hidden")
        
        var rect = slice.selectAll("rect")
            .data(function (d) { return d.sales; })
            .enter().append("rect")
            .attr("width", x1Scale.bandwidth())
            .attr("x", function (d) { ; return x1Scale(d.burger) + margin.left })
            .style("fill", function (d) { return color(d.burger) })
            .attr("class", function (d) {
                return d.burger;
            })
            .attr("y", function (d) { return yScale(0); })
            .attr("height", function (d) { return height - yScale(0); })
            .on("mouseover", function (d) {
                d3.select(this)
                    .style("opacity", 0.7)
                
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html("<span>" + d.count + "</span>")
                        .style("left", "${d3.event.layerX}px")
                        .style("top", "${(d3.event.layerY - 28)}px")   
                
                return tooltip.style("visibility", "visible")
                             
            })
            .on("mouseout", function () {
                d3.select(this)
                    .style("opacity", 1);
                
                tooltip.transition().duration(500).style("opacity", 0);
                return tooltip.style("visibility", "hidden")
            })

            .on("mousemove", function(){
                return tooltip.style("top", (d3.event.pageY-10)+ "px").style("left", (d3.event.pageX+10)+ "px")
            })

            .on("mouseclick", function(d){

            });
        

        slice.selectAll("g>rect")
            .transition()
            .duration(1000)
            .attr("y", function (d) { return yScale(d.count); })
            .attr("height", function (d) { return height - yScale(d.count); });

        update = function (selectedBurger) {

            console.log(selectedBurger)
            reset = function () {
                slice.selectAll("rect")
                    .transition()
                    .duration(300)
                    .attr("width", x1Scale.bandwidth())
                    .attr("x", function (d) { return x1Scale(d.burger) + margin.left })
                    .attr("y", function (d) { return yScale(d.count); })
                    .attr("height", function (d) { return height - yScale(d.count); })
            }
            reset();
            // slice.selectAll("rect")
            //     .style("visibility", "hidden")

            // var hey = slice.selectAll("." + selectedBurger.split(" ")[0] + "." + selectedBurger.split(" ")[1])
            //     .style("visibility", "visible");

            slice.selectAll("rect")
                .filter(function (d, i) {
                    return !(d.burger == selectedBurger);
                })
                .transition()
                .duration(300)
                .attr("height", 0)
                .attr("y", height)
        }


    })
}   