function getSelectedData() {
    let dateSelected;
    $('.calendar_ctnr').datepicker({
        firstDay: 0,
        firstMonth: 3,
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',

        onSelect: function (dateText, inst) {
            dateSelected = dateText;
           // allBurgerSales(dateSelected);
        }
    });
}

// function allBurgerSales(picked) {
//     d3.json("http://localhost:3000/sales", function (krustyData) {
//         let krustyDeluxe = 0, krustyCombo = 0, krabbyPattie = 0;
//         let burgerSales;

//         selectedDate = new Date(picked);
//         selectedDateString = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();

//         for (x in krustyData) {
//             var datesInData = new Date(krustyData[x].datetime);
//             var dataDateString = datesInData.getFullYear() + "-" + (datesInData.getMonth() + 1) + "-" + datesInData.getDate();

//             if (selectedDateString == dataDateString) {
                
//                 if (krustyData[x].burger == "Krusty Deluxe") {
//                     krustyDeluxe++;
//                 } else if (krustyData[x].burger == "Krusty Combo") {
//                     krustyCombo++;
//                 } else if (krustyData[x].burger == "Krabby Pattie") {
//                     krabbyPattie++;
//                 }
//             }
//         }

//         console.log("Krusty Deluxe: " + krustyDeluxe);
//         console.log("Krusty Combo: " + krustyCombo);
//         console.log("Krabby Pattie: " + krabbyPattie);

//         burgerSales = [krustyCombo, krustyDeluxe, krabbyPattie];

//         var svgWidth = 300, svgHeight = 300, barWidth = 40, barPadding = 5;

//         var svg = d3.select("#burger_today").append("svg")
//             .attr("width", svgWidth)
//             .attr("height", svgHeight)

//         var bar_chart = svg.selectAll("rect")
//             .data(burgerSales)
//             .enter()
//             .append("rect")
//             .attr("y", function (d) {
//                 return svgHeight - d;
//             })

//             .attr("height", function (d) {
//                 return d;
//             })

//             .attr("width", barWidth - barPadding)
//             .attr("transform", function (d, i) {
//                 var translate = [barWidth * i, 0];
//                 return "translate(" + translate + ")";
//             })
//     });
// }


function allSpeciesSale(picked) {
    let leather=0, salmon=0,seahorse=0,coral=0, clam=0, whale=0,sealion=0;
    let species = ["leatherback turtle", "salmon", "seahorse", "coral", "giant clam", "gray whale", "sea lion"];

    
    

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