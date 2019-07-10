function importBurgerSales(){
    d3.json("http://localhost:3000/burger_sales").then(function(data){
        var burger = [], count = [];

        for(x in data){
            count.push(data[x]);
            burger.push(x);
        }

        var jsonString = multjsonparser(burger, count, ["burger", "count"]);
        var burgerData = toJson(jsonString);

        console.log(burgerData);

        var margin = { top: 10, left: 25, right: 50, bottom: 10 },
            width = 450 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var canvas = d3.select("#bgr_sales").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var xScale = d3.scaleBand()
        .domain(burger)
        .range([0, width - margin.left - margin.right])

        var yScale = d3.scaleLinear()
            .domain([0, Math.ceil(d3.max(count)/100) * 100])
            .range([height - margin.top - margin.bottom, 0])
        
        var xAxis = d3.axisTop()
            .scale(xScale)
            .tickSize(0)
        
        var yAxis = d3.axisLeft()
            .scale(yScale)
        
        canvas.append("g")
            .attr("transform", "translate(" + (margin.left - 5) + "," + 0 + ")")
            .call(yAxis)
            .style("color", "yellow")
            .style('opacity', '0')
        
        canvas.append("g")
            .attr("transform", "translate(" + (margin.left - 5) + ","+ (height-20) + ")")
            .call(xAxis)

        
        
    })
}