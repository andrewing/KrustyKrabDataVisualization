$(document).ready(function(){
    $("#logInButton").click(function(){
        if($("#username").val() == 'admin' && $("#password").val() == 'p@ssword'){
             window.open("dashboard.html", "_self");
        }
    })
    
})
