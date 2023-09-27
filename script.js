// JavaScript source code
//
var form = document.getElementById('checkingPasswords');
var new_password = form.new_password;
var confirm_new_password = form.confirm_new_password;
var alertText = document.getElementById('alert');
let confirmed = false;

confirm_new_password.addEventListener('input', () => {
    if (new_password.value != confirm_new_password.value) {
        alertText.innerHTML = 'Passwords do not match.';
        confirmed = false;
    }
    else {
        alertText.innerHTML = '';
        confirmed = true;
    }
});
form.onsubmit = function () {
    if (confirmed) {
        alert('Password has been updated!');
        return true;
    }
    alert('Try again.');
    return false;
};
