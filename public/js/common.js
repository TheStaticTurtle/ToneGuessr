function sendResetGuesses() {
    axios.post('/api/user/reset', {
    }).then(function (response) {
        $("#confirmGuessesReset").modal('hide')
        console.log(response);
    }).catch(function (error) {
        $("#confirmGuessesReset").modal('hide')
        console.log(error);
    });

}