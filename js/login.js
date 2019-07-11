
$(document).ready(function(){
    $("#logInButton").click(logIn);
    $(document).keypress(function(event){
        if(event.keyCode == '13'){
            logIn();
        }
    })
})

var logIn = function(){
    var un = $("#username").val();
    var pw = $("#password").val();
    if(un == 'admin' && pw == 'p@ssword'){
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
        $("#username").css('border-bottom-color', 'white');
        $("#password").css('border-bottom-color', 'white');
    })
    $("#password").click(function(){
        $("#username").css('border-bottom-color', 'white');
        $("#password").css('border-bottom-color', 'white');
    })
}


