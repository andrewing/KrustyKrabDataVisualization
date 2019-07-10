var drawBurgerSales;
var drawSpeciesSales;
var drawBurgerBySpecies;
var drawBurgerBySpeciesBar;

var updateBurgerSales;
var updateSpeciesSales;
var updateBurgerBySpecies;
var updateBurgerBySpeciesBar;

var update2;
var reset2;
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
        var burgerSales;
        if (burgerTypes.length != 0 || burgerCount.length != 0) {
            var burgerParser = multjsonparser(burgerTypes, burgerCount, ["burger", "count"]);
            burgerSales = toJson(burgerParser);
        } else {
            burgerSales = null;
        }
        updateBurgerSales(burgerSales, burgerTypes, burgerCount);

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
        let speciesSales;
        if (speciesTypes.length != 0 || speciesCount.length != 0) {
            let speciesParser = multjsonparser(speciesTypes, speciesCount, ["species", "count"]);
            speciesSales = toJson(speciesParser);
        } else {
            speciesSales = null;
        }
        // console.log(speciesSales);
        updateSpeciesSales(speciesSales, speciesTypes, speciesCount);
        // gets the burger by species sales of that day
        var info = [], burger = [], species = [], count = [];


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
            var bu = []
            bu.burger = burger[t]
            bu.species = species[t]
            bu.count = count[t]

            info.push(bu);
        }

        var speciesUnique = species.filter((x, i, a) => a.indexOf(x) == i)
        var singleJSON;
        var burgerBySpecies = []
        for (x in speciesUnique) {
            singleJSON = { species: speciesUnique[x], sales: [] }
            burgerBySpecies.push(singleJSON);
        }

        for (x in burgerBySpecies) {
            for (y in info) {
                if (info[y].species == burgerBySpecies[x].species) {
                    burgerBySpecies[x].sales.push({ burger: info[y].burger, count: info[y].count });
                }
            }
        }

        updateBurgerBySpecies(burgerSales, burgerTypes);
        updateBurgerBySpeciesBar(burgerBySpecies, speciesTypes, burgerTypes, count);


    })




}

var drawByDaySales = function () {
    drawBurgerBySpecies = function () {
        var margin = { top: 20, bottom: 20, right: 50, left: 25 },
            height = 200 - margin.top - margin.bottom,
            width = 200 - margin.right - margin.left;

        var canvas = d3.select("#burgerBySpecies_day").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "species_sale_percentage_day")
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var xScale = d3.scaleBand()
            .domain(["All"])
            .range([0, width - margin.left - margin.right])
            .paddingInner([0.2])

        var yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margin.top - margin.bottom, 0])

        var color = d3.scaleOrdinal()
            .range(['violet', '#FFDB58', 'turquoise'])

        updateBurgerBySpecies = function (bsData, burger) {
            canvas.selectAll("rect.day").remove();
            canvas.selectAll(".legendDay").remove();
            var burgerSalesData = bsData;
            color.domain(burger);
            var string = "";
            for (x in burgerSalesData) {
                string += JSON.stringify(burgerSalesData[x].burger) + ":" + JSON.stringify(burgerSalesData[x].count) + ",";
            }
            string = string.slice(0, string.length - 1);
            string = "{" + string + "}";
            burgerSalesData = JSON.parse(string);

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


            var pctbar = canvas.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter()
                .append("g")
                .attr("fill", function (d) { return color(d.key) })
                .on("mouseover", function (d) {
            
                    update2(d.key);
                })
                .selectAll("rect")
                .data(function (d) { return d; })
                .enter().append("rect")
                .attr("y", function (d) { return yScale(d[1]) + margin.top; })
                .attr("x", margin.left + 15)
                .attr("height", function (d) { return 0; })
                .attr("width", xScale.bandwidth())
                .attr("class", "day")
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
                    reset2()
                })

            pctbar.transition()
                .duration(1000)
                .attr("height", function (d) {
                    return yScale(d[0]) - yScale(d[1])
                })


            var legend = canvas.selectAll(".legendDay")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legendDay")

            legend.transition()
                .duration(1000)
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




        }
    }

    drawBurgerBySpeciesBar = function () {
        var margin = { top: 20, right: 20, left: 20, bottom: 20 },
            width = 470 - margin.right - margin.left,
            height = 200 - margin.top - margin.bottom;

        var canvas = d3.select('#burgerBySpecies_day').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x0Scale = d3.scaleBand()
            .domain([])
            .range([0, width])
            .round([0.1])
            .paddingInner([0.2]);
        var x1Scale = d3.scaleBand();

        var yScale = d3.scaleLinear()
            .domain([])
            .range([height, 0])

        var xAxis = d3.axisBottom()
            .scale(x0Scale)
            .tickSize(0)

        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);
        var color = d3.scaleOrdinal()
            .range(['violet', 'turquoise', '#FFDB58', 'rgb(253, 180, 98)']);

        canvas.append("g")
            .attr("class", "xAxis day bbs")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(xAxis);

        canvas.append("g")
            .attr("class", "yAxis day bbs")
            .style('opacity', '1')
            .attr("transform", "translate(" + (margin.left - 5) + ", " + 0 + ")")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Count");

        var gridAxis = d3.axisRight()
            .scale(yScale)
            .tickSize(width + margin.right, 0, 0)
            .tickFormat('')
            .ticks(5)

        var grid = canvas.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + (margin.left - 5) + ", " + 0 + ")")
            .call(gridAxis)


        updateBurgerBySpeciesBar = function (data, species, burgerNames, count) {
            canvas.selectAll("rect").remove();
            x0Scale.domain(species);
            xAxis.scale(x0Scale)
            d3.selectAll("g.xAxis.day.bbs")
                .transition()
                .duration(500)
                .call(xAxis);
            yScale.domain([0, Math.ceil(d3.max(count) / 10) * 10])
            yAxis.scale(yScale)
            d3.selectAll("g.yAxis.day.bbs")
                .transition()
                .duration(500)
                .call(yAxis)
            gridAxis.scale(yScale);
            grid.transition().duration(500).call(gridAxis);

            x1Scale.domain(burgerNames)
                .range([0, x0Scale.bandwidth()])

            var slice = canvas.selectAll(".slice")
                .data(data)
                .enter().append("g")
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
                    return d.burger + " day";
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

                .on("mousemove", function () {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px")
                })

                .on("mouseclick", function (d) {

                });


            slice.selectAll("rect")
                .transition()
                .duration(1000)
                .attr("y", function (d) { return yScale(d.count); })
                .attr("height", function (d) { return height - yScale(d.count); });

            update2 = function (selectedBurger) {


                reset2 = function () {
                    slice.selectAll("rect")
                        .transition()
                        .duration(300)
                        .attr("width", x1Scale.bandwidth())
                        .attr("x", function (d) { return x1Scale(d.burger) + margin.left })
                        .attr("y", function (d) { return yScale(d.count); })
                        .attr("height", function (d) { return height - yScale(d.count); })
                }
                reset2();
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

        }

    }

    drawBurgerSales = function () {
        var margin = { top: 20, bottom: 20, right: 20, left: 20 },
        height = 250 - margin.top - margin.bottom,
        width = 400 - margin.left - margin.right;
        var canvas = d3.select("#burgerSales_day").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var xScale = d3.scaleBand()
            .range([0, width])
            .round([0, 1])
            .paddingInner([0.2])
            .domain([])

        var yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([])

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(0)

        var yAxis = d3.axisLeft()
            .scale(yScale)
        var gridAxis = d3.axisRight()
            .scale(yScale)
            .tickSize(width + margin.right, 0, 0)
            .tickFormat('')
        var grid = canvas.append("g")
            .attr("class", "grid")
            .call(gridAxis)
            .attr("transform", "translate(" + (margin.left - 5) + "," + 0 + ")")

        canvas.append("g")
            .attr("class", "xAxis day bs")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(xAxis)

        canvas.append("g")
            .attr("class", "yAxis day bs")
            .style('opacity', '1')
            .attr("transform", "translate(" + (margin.left - 5) + ", " + 0 + ")")
            .call(yAxis)
        updateBurgerSales = function (data, burger, count) {
            canvas.selectAll("rect").remove()
            xScale.domain(burger)
            xAxis.scale(xScale)
            d3.selectAll("g.xAxis.day.bs")
                .transition()
                .duration(500)
                .call(xAxis)
            yScale.domain([0, Math.ceil(d3.max(count) / 20) * 20])
            yAxis.scale(yScale)
            d3.selectAll("g.yAxis.day.bs")
                .transition()
                .duration(500)
                .call(yAxis);

            gridAxis.scale(yScale);
            grid.transition().duration(500).call(gridAxis);
            const bar = canvas.selectAll()
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d) {
                    return "translate(" + xScale(d.burger) + ",0)";
                })

            const rect = bar.append("rect")
                .attr("width", function (d) {
                    return 0;
                })
                .attr("x", function (d) {
                    return yScale(d.burger);
                })
                .attr("width", xScale.bandwidth() - 80)
                .attr("fill", "orange")
                .attr("transform", "translate(" + (margin.left + 40) + ", 0)")
                .attr("y", function (d) { return yScale(0); })
                .attr("height", function (d) { return height - yScale(0); })


            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("visibility", "hidden")

            rect.transition()
                .duration(1000)
                .attr("y", function (d) { return yScale(d.count); })
                .attr("height", function (d) { return height - yScale(d.count); })
                .on("end", function () {
                    rect.on("mouseover", function (actual, i) {
                        d3.select(this)
                        tooltip.transition().duration(500).style("visibility", "visible").text(actual.count);


                    })

                    rect.on("mousemove", function () {
                        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                    })

                    rect.on("mouseout", function () {
                        tooltip.transition().duration(500).style("visibility", "hidden");
                    })

                })
        }
    }

    drawSpeciesSales = function () {
        var margin = { top: 20, bottom: 20, right: 20, left: 100 },
            height = 250 - margin.top - margin.bottom,
            width = 410 - margin.right - margin.left;


        var xScale = d3.scaleLinear()
            .range([0, width])
            .domain([])
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
            .attr("class", "xAxis day ss")
            .attr("transform", "translate(" + margin.left + ", " + (margin.top - 1) + ")")
            .call(xAxis)
            .append("text")
            .attr("y", -10)
            .attr("x", -10)
            .attr("text-anchor", "end")
            .text("Count")

        var yg = canvas.append("g")
            .attr("class", "yAxis day ss")
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
            d3.selectAll("g.xAxis.day.ss")
                .transition()
                .duration(500)
                .call(xAxis);
            yScale.domain(species)
            yAxis.scale(yScale)
            d3.selectAll("g.yAxis.day.ss")
                .transition()
                .duration(500)
                .call(yAxis)
            gridAxis.scale(xScale);
            grid.transition().duration(500).call(gridAxis);



            canvas.selectAll("rect").remove()
            canvas.selectAll(".toolTip.value").remove()
            if (data != null) {
                var bar = canvas.selectAll()
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

                const tooltip = bar.append("text")
                    .attr("class", "toolTip value")
                    .attr("text-anchor", "end")
                    .attr("fill", "#2884cf")
                    .attr("y", (a) => margin.top + yScale(a.species) + yScale.bandwidth() - 5)
                    .attr("x", (a) => margin.left + 20)
                    .text((a) => a.count)


                tooltip.transition()
                    .duration(1050)
                    .attr("fill", "gray")
                    .attr("transform", function (d) {
                        return "translate(" + (xScale(d.count) - 25) + "," + 0 + ")";
                    })
            }
        }

    }
    drawSpeciesSales();
    drawBurgerSales();
    drawBurgerBySpecies();
    drawBurgerBySpeciesBar();
}
