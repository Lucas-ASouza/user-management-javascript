var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

fields.forEach(function(field, index){

    if (field.name == "gender"){

        if (field.checked){
            user[field.name] = fied.value;
        }

    } else{

        user[field.name] = field.value;

    }
    //console.log(field.id, field.name, field.value, field.checked, index);
    console.log(user);
});