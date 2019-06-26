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

    // scroll animation
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();
    
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 600);

    });

    //link lights up when in that page

    let mainNavLinks = document.querySelectorAll(".menu-item a");
    window.addEventListener("scroll", event => {
    let fromTop = window.scrollY;

    mainNavLinks.forEach(link => {
        let section = document.querySelector(link.hash);

            if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop+2
            ) {
            link.classList.add("currentpage");
            } else {
            link.classList.remove("currentpage");
            }
        });
    });
    
});

function toggle() {
    document.getElementById("menu-barID").classList.toggle('active');
    document.getElementById("menu-iconID").classList.toggle('active');
}
