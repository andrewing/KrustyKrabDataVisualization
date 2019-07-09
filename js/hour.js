function importHourSales() {

    var margin = { top: 20, bottom: 20, left: 20, right: 20 },
        height = 200 - margin.top - margin.bottom,
        width = 450 - margin.left - margin.right;

    var xScale = d3.scaleTime()
        .range([0, width - margin.left - margin.right])

    var yScale = d3.scaleLinear()
        .range([height, 0])

    var canvas = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        


    d3.json("http://localhost:3000/sales").then(function (data) {
        var dates = [], hours = [];
        for (x in data) {
            dates.push(new Date(data[x].datetime));
        }

        for (var i = 0; i < 24; i++) {
            hours.push(i);
        }

        xScale.domain(hours)

        var xAxis = d3.axisBottom()
            .scale(xScale)

        canvas.append("g")
            .attr("transform", "translate(" + 0 + ", " + height + ")")
            .call(xAxis)
        // var valueline = d3.line()
        // .x(function(){
        //     return xScale(hours);
        // })
        // .y(function(d){
        //     return yScale()
        // })

    })
}