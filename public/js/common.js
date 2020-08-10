function sendResetGuesses() {
    axios.post(base_uri+'api/user/reset', {
    }).then(function (response) {
        $("#confirmGuessesReset").modal('hide')
        location.reload();
        console.log(response);
    }).catch(function (error) {
        $("#confirmGuessesReset").modal('hide')
        console.log(error);
    });
}
function sendDeleteAccount() {
    axios.post(base_uri+'api/user/delete', {
    }).then(function (response) {
        $("#confirmDelete").modal('hide')
        setTimeout(function () {
            location.reload()
        }, 100);
        console.log(response);
    }).catch(function (error) {
        $("#confirmDelete").modal('hide')
        console.log(error);
    });

}

function saveUserData() {
    let n_name  = document.getElementById("username").value
    let n_email = document.getElementById("email").value
    let n_age   = document.getElementById("age").value
    n_age = n_age === "" ? -1 : n_age

    axios.post(base_uri+'api/user/save', {
        name: n_name,
        email:n_email,
        age: n_age
    }).then(function (response) {
        location.reload();
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}