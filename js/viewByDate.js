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
            dateSelectedString = format.getFullYear() + "-" + (format.getMonth()+1) + "-" + format.getDate();
            getSalesData(dateSelectedString);
            // allBurgerSales(dateSelectedString);
        }
    });
}

function getSalesData(pickedDate){
    d3.json("http://localhost:3000/sales").then(function(data){
        let dataArr = [], burgerTypes = [], burgerCount = [], speciesTypes=[], speciesCount = [];
        let inc = 0;

        for(x in data) {
            var datesInData = new Date(data[x].datetime);
            var dataDateString = datesInData.getFullYear() + "-" + (datesInData.getMonth() + 1) + "-" + datesInData.getDate();
            
            if(pickedDate == dataDateString){
               dataArr.push(data[x]);
            }
        }

        for(b in dataArr) {
            var thisBurger = dataArr[b].burger;
            if(burgerTypes.includes(thisBurger) == false){
                burgerTypes.push(dataArr[b].burger);
            }
        }
        burgerTypes.sort();

        for(s in dataArr){
            var thisSpecie = dataArr[s].species;
            if(speciesTypes.includes(thisSpecie) == false){
                speciesTypes.push(dataArr[s].species);
            }
        }
        speciesTypes.sort();

        for(let ctr=0; ctr<burgerTypes.length; ctr++){
            for(let y=0; y< dataArr.length; y++){
                if(burgerTypes[ctr] == dataArr[y].burger){
                    inc++;
                }
            }
            burgerCount.push(inc);
            inc = 0;
        }

        var burgerParser = multjsonparser(burgerTypes, burgerCount, ["burger", "count"]);
        var burgerSales = toJson(burgerParser);

        console.log(burgerSales);
        

        for(let cntr=0; cntr<speciesTypes.length; cntr++){
            for(let z=0; z< dataArr.length; z++){
                if(speciesTypes[cntr] == dataArr[z].species){
                    inc++;
                }
            }
            speciesCount.push(inc);
            inc = 0;
        }

        let speciesParser = multjsonparser(speciesTypes, speciesCount, ["species", "count"]);
        let speciesSales = toJson(speciesParser);
        console.log(speciesSales);

        let Obj = function(name) {
            this.name = name;
        }

        var burgerBySpecies = [], burger = [], species = [], count = [];
        var info = [];

        for(st in speciesTypes){
            for(o in burgerTypes){
                for(d in dataArr){
                    if(dataArr[d].species == speciesTypes[st] && dataArr[d].burger == burgerTypes[o]){
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

        for(t in burger){
            info.push([burger[t],species[t], count[t]]);
        }
        
        console.log(info);
        
    });
}


// function dataset(){
//     d3.json("http://localhost:3000/burger_sales", function(krustyData){

//     console.log(d3.values(krustyData));
//     var bgrsales = d3.values(krustyData);

//     var svgWidth = 500, svgHeight = 500, barPadding = 5;
//         var barWidth = 40;

//         var svg = d3.select('svg')
//             .attr("width", svgWidth)
//             .attr("height", svgHeight)

//         var bar_chart = svg.selectAll("rect")
//                 .data(bgrsales)  
//                 .enter()  
//                 .append("rect")  
//                 .attr("y", function(d) {  
//                     return svgHeight - d  
//                 })  
//                 .attr("height", function(d) {  
//                     return d;  
//                 })  
//                 .attr("width", barWidth - barPadding)  
//                 .attr("transform", function (d, i) {  
//                     var translate = [barWidth * i, 0];  
//                     return "translate("+ translate +")";  
//                 });
//     });
// }