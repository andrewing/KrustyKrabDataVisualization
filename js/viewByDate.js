var drawBurgerSales;
var drawSpeciesSales;
var updateSpeciesSales;
var first = false;
function getSelectedData() {
    let dateSelected, format, dateSelectedString;
    $('.calendar_ctnr').datepicker({
        firstDay: 0,
        firstMonth: 3,
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',

        onSelect: function (dateText, inst) {
            dateSelected = dateText;
            format = new Date(dateSelected);
            dateSelectedString = format.getFullYear() + "-" + (format.getMonth() + 1) + "-" + format.getDate();
            getSalesData(dateSelectedString);
        }
    });
}

function getSalesData(pickedDate) {
    d3.json("http://localhost:3000/sales").then(function (data) {
        let dataArr = [], burgerTypes = [], burgerCount = [], speciesTypes = [], speciesCount = [];
        let inc = 0;


        // getting the sales of the picked date
        for (x in data) {
            var datesInData = new Date(data[x].datetime);
            var dataDateString = datesInData.getFullYear() + "-" + (datesInData.getMonth() + 1) + "-" + datesInData.getDate();

            if (pickedDate == dataDateString) {
                dataArr.push(data[x]);
            }
        }

        // lists the burger types in the json file
        for (b in dataArr) {
            var thisBurger = dataArr[b].burger;
            if (burgerTypes.includes(thisBurger) == false) {
                burgerTypes.push(dataArr[b].burger);
            }
        }
        burgerTypes.sort();

        // lists the species type in the json file
        for (s in dataArr) {
            var thisSpecie = dataArr[s].species;
            if (speciesTypes.includes(thisSpecie) == false) {
                speciesTypes.push(dataArr[s].species);
            }
        }
        speciesTypes.sort();

        // gets the total sale of each burger type that day
        for (let ctr = 0; ctr < burgerTypes.length; ctr++) {
            for (let y = 0; y < dataArr.length; y++) {
                if (burgerTypes[ctr] == dataArr[y].burger) {
                    inc++;
                }
            }
            burgerCount.push(inc);
            inc = 0;
        }

        var burgerParser = multjsonparser(burgerTypes, burgerCount, ["burger", "count"]);
        var burgerSales = toJson(burgerParser);

        // console.log(burgerSales);


        // gets the total sale of each species that day
        for (let cntr = 0; cntr < speciesTypes.length; cntr++) {
            for (let z = 0; z < dataArr.length; z++) {
                if (speciesTypes[cntr] == dataArr[z].species) {
                    inc++;
                }
            }
            speciesCount.push(inc);
            inc = 0;
        }

        let speciesParser = multjsonparser(speciesTypes, speciesCount, ["species", "count"]);
        let speciesSales = toJson(speciesParser);
        // console.log(speciesSales);
        updateSpeciesSales(speciesSales, speciesTypes, speciesCount);
        // gets the burger by species sales of that day
        let burger = [], species = [], count = [];
        let info = [];

        for (st in speciesTypes) {
            for (o in burgerTypes) {
                for (d in dataArr) {
                    if (dataArr[d].species == speciesTypes[st] && dataArr[d].burger == burgerTypes[o]) {
                        inc++;
                    }
                    d++;
                }
                burger.push(burgerTypes[o]);
                species.push(speciesTypes[st]);
                count.push(inc);
                inc = 0;
                o++;
            }
            st++;
        }

        for (t in burger) {
            info.push([burger[t], species[t], count[t]]);
        }

        // console.log(info);




    })




}

var drawByDaySales = function () {
    drawBurgerSales = function () {
        var margin = { top: 20, bottom: 20, right: 20, left: 20 },
            height = 250 - margin.top - margin.bottom,
            width = 400 - margin.left - margin.right;
    }

    drawSpeciesSales = function () {
        var margin = { top: 20, bottom: 20, right: 20, left: 100 },
            height = 250 - margin.top - margin.bottom,
            width = 410 - margin.right - margin.left;


        var xScale = d3.scaleLinear()
            .range([0, width])
        // .domain(null)
        var yScale = d3.scaleBand()
            .range([0, height + margin.bottom])
            .paddingInner(0.4)
        // .domain(null)
        var xAxis = d3.axisTop()
            .scale(xScale)

        var yAxis = d3.axisLeft()
            .scale(yScale)

        var canvas = d3.select("#speciesSales_day").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "species_sale_day")
            .append("g")

        var xg = canvas.append("g")
            .attr("class", "xAxis day")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top - 1) + ")")
            .call(xAxis)
            .append("text")
            .attr("y", -10)
            .attr("x", -10)
            .attr("text-anchor", "end")
            .text("Count")

        var yg = canvas.append("g")
            .attr("class", "yAxis day")
            .attr("transform", "translate(" + (margin.left - 1) + ", " + margin.top + ")")
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.5em")
            .attr("dy", "-0.55em")
            .attr("y", 10)
            .selectAll(".tick text");

        var gridAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(height + margin.top + margin.bottom, 0, 0)
            .tickFormat('')
        var grid = canvas.append('g')
            .attr('class', 'grid')
            .attr("transform", "translate(" + (margin.left) + ", " + (margin.top - 1) + ")")
            .call(gridAxis)

        updateSpeciesSales = function (data, species, count) {
            xScale.domain([0, Math.ceil(d3.max(count) / 10) * 10])
            xAxis.scale(xScale)
            d3.selectAll("g.xAxis.day")
                .transition()
                .duration(500)
                .call(xAxis);
            yScale.domain(species)
            yAxis.scale(yScale)
            d3.selectAll("g.yAxis.day")
                .transition()
                .duration(500)
                .call(yAxis)
            gridAxis.scale(xScale);
            grid.transition().duration(500).call(gridAxis);

            var bar;
            if (first) {
                console.log(first)
                
            }
            first=true;
            bar = canvas.selectAll()
                .data(data)
                .enter()
                .append("g")
            var rect = bar.append("rect")
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

        }

    }


    drawSpeciesSales();
}
