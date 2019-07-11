$(document).ready(function(){
    
    // transfers the json file to html table 
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
    
    // scroll animation
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();
    
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top+2
        }, 600);

    });

    $('.menu-btn').click(toggle);

    //link lights up when clicked
    $('ul li a').click(function(){
        $('li a').removeClass("currentpage");
        $(this).addClass("currentpage");
    });

    //link lights up when scrolled
    $(window).scroll(function(){
        var  scrollDistance = $(window).scrollTop();
        $('.webpage').each(function(i) {
            if ($(this).position().top <= scrollDistance) {
                    $('a.currentpage').removeClass('currentpage');
                    $('a').eq(i).addClass('currentpage');
            }
    });
    }).scroll();

});

// toggles the side navigation
function toggle() {
    document.getElementById("menu-barID").classList.toggle('active');
    document.getElementById("menu-iconID").classList.toggle('active');
    document.getElementById("home_stats").classList.toggle('active');
    document.getElementById("cal_stats").classList.toggle('active');
    document.getElementById("scrolldivID").classList.toggle('active');
}
