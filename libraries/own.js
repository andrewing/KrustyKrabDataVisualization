var jsonparser = function (labels, values, id) {
    var obj = '';
    if (labels.length == values.length) {
        obj += '{';
        for (var i = 0; i < labels.length; i++) {
            obj += JSON.stringify(labels[i]) + ':' + JSON.stringify(values[i]);
            if (i != labels.length - 1) {
                obj += ',';
            }
        }
        obj += '}';
    }
    return obj
}

var multjsonparser = function (oldLabels, oldValues, newLabels) {
    var obj = '';
    if (oldLabels.length == oldValues.length) {
        for (var i = 0; i < oldLabels.length; i++) {
            obj += jsonparser(newLabels, [oldLabels[i], oldValues[i]], i);
            if (i != oldLabels.length - 1) {
                obj += '\n,';
            }
        }
    }
    return obj;
}

var toJson = function (jsonString) {
    var newData = [];
    jsonString = jsonString.split("\n,");
    for (m in jsonString) {
        newData.push(JSON.parse(jsonString[m]));
    }

    return newData;
}