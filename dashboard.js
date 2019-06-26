$(document).ready(function(){
    $.getJSON("http://localhost:3000/sales", function(data){
        let krusty_data = '';

        $.each(data, function(index,value){
            krusty_data += '<tr>';
            krusty_data += '<td>'+ value.datetime +'</td>';
            krusty_data += '<td>'+ value.burger +'</td>';
            krusty_data += '<td>'+ value.species +'</td>';
            krusty_data += '</tr>';
        });

        $("#tblbody").append(krusty_data);

    });
});


function toggle() {

    var elem = document.getElementById("menu-barID"),
        style = window.getComputedStyle(elem),
        left = style.getPropertyValue("left");

    var btn = document.getElementById("menu-iconID"),
        style = window.getComputedStyle(btn),
        content = style.getPropertyValue("content");

    var table = document.getElementById("tableCtnr"),
        style = window.getComputedStyle(table),
        marginleft = style.getPropertyValue("margin-left");
    
    if(left == "0px") {
        elem.style.left = "-205px";
        btn.style.content = "url(resources/show.png)";
        //table.style.marginLeft = "40px";

    }else {
        elem.style.left = "0px";
        btn.style.content = "url(resources/hide.png)";
        //table.style.marginLeft = "250px";
    }
}
