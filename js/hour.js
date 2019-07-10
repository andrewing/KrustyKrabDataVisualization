function importHourSales() {

    var margin = { top: 20, bottom: 60, left: 20, right: 20 },
        height = 250 - margin.top - margin.bottom,
        width = 690 - margin.left - margin.right;

    var xScale = d3.scaleTime()
        .range([0, width - margin.left - margin.right])

    var yScale = d3.scaleLinear()
        .range([height, 0])




    var canvas = d3.select("#dayHour_sales").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.json("http://localhost:3000/sales").then(function (data) {
        var dates = [], hours = [], count = [], dateonly = []

        for (x in data) {
            var a = new Date(data[x].datetime)
            a.setMinutes(0);
            a.setSeconds(0);
            a.setMilliseconds(0);
            var b = { date: a, count: 1 }
            if (!isInArray(dates, a)) {
                dates.push(b);
                dateonly.push(a);
            } else {
                for (y in dates) {
                    if ((dates[y].date - a) == 0) {
                        dates[y].count++;
                    }
                }
            }
        }


        var alldates = [];
        var ctr = 1;

        do {
            var newDate = new Date(d3.min(dateonly));
            newDate.setHours(newDate.getHours() + ctr)
            alldates.push(newDate)
            ctr++
        } while (newDate.getDate() != d3.max(dateonly).getDate()
            || newDate.getHours() != d3.max(dateonly).getHours());


        for (x in alldates) {
            if (!isInArray(dates, alldates[x])) {
                dates.push({ date: alldates[x], count: 0 })
            }
        }

        dates.sort(function (a, b) {
            return b.date - a.date;
        })


        // console.log(dates);
        // for (x in dates) {
        //     if (!hours.includes(dates[x].getHours())) {
        //         hours.push(dates[x].getHours())
        //     }
        // }

        // hours.sort(function (a, b) { return a - b });

        // for (x in hours) {
        //     count.push(0);
        //     for (y in dates) {
        //         if (dates[y].getHours() == hours[x]) {
        //             count[x]++;
        //         }
        //     }
        // }

        // for (x in hours) {
        //     hours[x] = hours[x] + ":00";
        // }
        // var dateonly = [];
        // dates.forEach(function (d) {
        //     d.date = parseTime(d.date)
        //     dateonly.push(d.date)
        // })


        var parseTime = d3.timeFormat("%B %-d|%-I%:00 %p")

        // console.log(d3.min(dates, function (d) {
        //     return d.date
        // }))

        // console.log(d3.max(dates, function (d) {
        //     return d.date;
        // }))

        xScale.domain([d3.min(dates, function (d) {
            return d.date;
        }),
        d3.max(dates, function (d) {
            return d.date;
        })])

        yScale.domain([0, Math.ceil(d3.max(dates, function (d) { return +d.count }) / 5) * 5])

        var valueline = d3.line()
            .x(function (d, i) {
                return xScale(d.date);
            })
            .y(function (d, i) {
                return yScale(d.count);
            })

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(20)
            .tickFormat(d3.timeFormat("%m/%d|%-I%p"))

        var yAxis = d3.axisLeft()
            .scale(yScale)


        canvas.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + margin.left + ", " + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(45)")
            .attr("text-anchor", "start")

        canvas.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + margin.left + ", " + 0 + ")")
            .call(yAxis)


        // var aasd = canvas.selectAll("g.xAxis g text").each(insertLinebreaks);
        // console.log(aasd)


        // var area = d3.area()
        //     .x(d => xScale(d.date))
        //     .y0(height - margin.top)
        //     .y1(d => yScale(d.count))

        var area = function (datum, boolean) {
            return d3.area()
                .y0(height - margin.top)
                .y1(function (d) { return boolean ? (yScale(d.count) - margin.top) : (height - margin.top); })
                .x(function (d) { return xScale(d.date); })
                (datum);
        }

        var gridy = canvas.append("g")
            .attr("class", "grid")
            .call(d3.axisRight()
                .scale(yScale)
                .tickSize(width - margin.right - margin.left, 0, 0)
                .tickFormat(''))
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")


        var graph = canvas.append("path")
            .datum(dates)
            .attr("transform", "translate(" + (margin.left + 1) + ", " + margin.top + ")")
            .attr("fill", "#f88379")
        
            .on("touchmove mouseover", function () {
                d3.select(this)
                    .transition()
                    .duration(300)
                    // .style("opacity", 0.7)
                    .attr("stroke-width", 2)
                gridy.transition()
                    .duration(500)
                    .style("opacity", 0)

                gridx.transition()
                    .duration(500)
                    .style("opacity", 1)

                focus.style("display", null);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .style("opacity", 1)
                    .attr("stroke-width", 1)

                gridy.transition()
                    .duration(500)
                    .style("opacity", 1)

                gridx.transition()
                    .duration(500)
                    .style("opacity", 0)
                focus.style("display", "none");

            })
            .on("mousemove", mousemove)
            .attr("d", d => area(d, false))
            .transition()
            .duration(450)
            .attr("d", d => area(d, true))
            .on("end", function(){
                
            })



        var gridx = canvas.append('g')
            .attr('class', 'grid')
            .style("opacity", 0)
            .attr("transform", "translate(" + (margin.left) + ", " + 0 + ")")
            .call(d3.axisBottom()
                .scale(xScale)
                .tickSize(height, 0, 0)
                .tickFormat('')
                .ticks(20))


        var focus = canvas.append("g")
            .attr("class", "focus")
            .style("display", "none")

        focus.append("circle")
            .attr("r", 5)
            .attr("fill", "#2884cf")
            .attr("stroke", "lightgray")
            .attr("stroke-width", "2.5px")

        focus.append("text")
            .attr("class", "salesToolTip")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11")
            .attr("y", 17)
            .attr("x", -37)

        focus.append("text")
            .attr("class", "datetimeToolTip")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11")
            .attr("y", 32)
            .attr("x", -37)

        // .attr("dy", ".31em");

        function mousemove() {


            var x0 = xScale.invert(d3.mouse(this)[0])
            var d0 = new Date(x0), d1 = new Date(x0);
            d0.setMinutes(0,0,0)
                
            d1.setHours(x0.getHours() + 1)
            d1.setMinutes(0,0,0);
            var df = x0 - d0 > d1 - x0 ? d1 : d0;
            var d = dates.filter(obj=>{
                return (obj.date - df) == 0;
            })
            d = d[0];
            focus.attr("transform", "translate(" + (xScale(d.date) + margin.left) + "," + (yScale(d.count)+2) + ")");
            focus.select("text.salesToolTip").text(function () { return "Sold:" + d.count + " burgers" });
            focus.select("text.datetimeToolTip").text(function () { return parseTime(d.date); });
        }
    })
}

function isInArray(array, value) {
    return array.find(item => { return (item.date.getDate() - value.getDate()) == 0 && (item.date.getHours() - value.getHours()) == 0 });
}
