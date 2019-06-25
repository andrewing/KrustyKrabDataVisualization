$(document).ready(function(){
    $("#logInButton").click(logIn);
    $(document).keypress(function(event){
        if(event.keyCode == '13'){
            logIn();
        }
    })
})

var logIn = function(){
    if($("#username").val() == 'admin' && $("#password").val() == 'p@ssword'){
        window.open("dashboard.html", "_self");
    }else{
        wrongPassword();
        retryPassword();    
    }
}

var wrongPassword = function(){
    alert("Wrong password");
    $("#username").css('border-bottom-color', '#d93025');
    $("#password").css('border-bottom-color', '#d93025');
}

var retryPassword = function(){
    $("#username").click(function(){
        $("#username").css('border-bottom-color', 'darkblue');
    })
    $("#password").click(function(){
        $("#password").css('border-bottom-color', 'darkblue');
    })
}


