function importHourSales() {
    d3.json("http://localhost:3000/sales").then(function (data) {
        var dates = []

        for (x in data) {
            dates.push(new Date(data[x].datetime));
        }

        
    })
}