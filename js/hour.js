function importHourSales() {

    var margin = { top: 20, bottom: 20, left: 20, right: 20 },
        height = 200 - margin.top - margin.bottom,
        width = 450 - margin.left - margin.right;

    var xScale = d3.scaleTime()
        .range([0, width - margin.left - margin.right])

    var yScale = d3.scaleLinear()
        .range([height, 0])




    var canvas = d3.select("#hello").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.json("http://localhost:3000/sales").then(function (data) {
        var dates = [], hours = [], count = []
        for (x in data) {
            var a = new Date(data[x].datetime)
            a.setMinutes(0);
            a.setSeconds(0);
            a.setMilliseconds(0);
            var b = { date: a, count: 1 }
            if (!isInArray(dates, a)) {
                dates.push(b);
            } else {
                for (y in dates) {
                    if ((dates[y].date - a) == 0) {
                        dates[y].count++;
                    }
                }

            }
        }

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
        // console.log(dates)

        var valueline = d3.line()
            .x(function (d, i) {
                return xScale(d.date);
            })
            .y(function (d, i) {
                return yScale(d.count);
            })

        xScale.domain(d3.extent)
        yScale.domain([0, Math.ceil(d3.max(count) / 20) * 20])

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(0)
        // .tickFormat(d3.format())

        var yAxis = d3.axisLeft()
            .scale(yScale)


        canvas.append("g")
            .attr("transform", "translate(" + margin.left + ", " + height + ")")
            .call(xAxis)

        canvas.append("g")
            .attr("transform", "translate(" + margin.left + ", " + 0 + ")")
            .call(yAxis)



        canvas.append("path")
            .data(data)
            .attr("d", valueline)

    })
}

function isInArray(array, value) {
    return array.find(item => { return (item.date.getDate() - value.getDate()) == 0 && (item.date.getHours() - value.getHours()) == 0 });
}