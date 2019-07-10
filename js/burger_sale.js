function importBurgerSales() {
    d3.json("http://localhost:3000/burger_sales").then(function (data) {
        
        var count = [], burger = [];

        for (x in data) {
            count.push(data[x]);
            burger.push(x);
        }
        
        var jsonString = multjsonparser(burger, count, ["burger", "count"]);
        var burgerSales = toJson(jsonString);
        /*---------------------------------------------------------------------------------------*/

        var margin = { top: 10, right: 10, bottom: 20, left: 20 },
            width = 430 - margin.right - margin.left,
            height = 205 - margin.top - margin.bottom,
            rectWidth = 100;
        
        var canvas = d3.select("#bgr_sales").append("svg")
            .attr("class", "canvas")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xScale = d3.scaleBand()
            .range([0, width])
            .round([0, 1])
            .paddingInner([0.2])
            .domain(burger)

        var yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, Math.ceil(d3.max(count)/ 100) * 100])

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(0)

        var yAxis = d3.axisLeft()
            .scale(yScale)

        canvas.append("g")
            .attr("class", "grid")
            .call(d3.axisRight()
                .scale(yScale)
                .tickSize(width+ margin.right, 0,0)
                .tickFormat(''))
            .attr("transform", "translate(" + (margin.left - 5)+ "," + 0 + ")")

        canvas.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(xAxis)

        canvas.append("g")
            .attr("class", "yAxis")
            .style('opacity', '0')
            .attr("transform", "translate(" + (margin.left-5) + ", " + 0 + ")")
            .call(yAxis)
            

        canvas.select('.yAxis')
            .transition()
            .duration(200)
            .style('opacity', '1');
        

        const bar = canvas.selectAll()
            .data(burgerSales)
            .enter()
            .append("g")
            .attr("transform", function(d){
                return "translate(" + xScale(d.burger) + ",0)";
            })

        const rect = bar.append("rect")
            .attr("width", function (d) {
                return 0;
            })
            .attr("x", function (d) {
                return yScale(d.burger);
            })
            .attr("width", xScale.bandwidth()-80)
            .attr("fill", "")
            .attr("transform", "translate(" + (margin.left+40) + ", 0)")
            .attr("y", function (d) { return yScale(0); })
            .attr("height", function (d) { return height - yScale(0); })
            
        /**code to add div for the tooltip
         * const hoverTooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
         */
        rect.transition()
            .duration(1000)
            .attr("y", function (d) { return yScale(d.count); })
            .attr("height", function (d) { return height - yScale(d.count); })
            .on("end", function(){
                rect.on("mouseover", function(actual, i){
                    d3.selectAll("")
                })
                /**code of adding tooltips to each of the bars, follows the mouse
                 *  .on("mouseover", function(){
                        hoverTooltip.style("visibility", "visible").text(actual.count)
                    }

                    mouseout{
                        hoverTooltip.style("visibility", "hidden")
                    }

                    .on("mousemove", function(){
                        return hoverTooltip.style("top", (event.pageY-10) + "px")
                                            .style("left", (event.pageX+10) + "px")
                    })
                */
            })
    })
}
