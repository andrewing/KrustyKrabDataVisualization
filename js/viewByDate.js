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

        console.log(burgerSales);


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
        console.log(speciesSales);

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

        console.log(info);
        
    }
}
