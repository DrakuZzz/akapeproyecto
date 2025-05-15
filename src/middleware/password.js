let password = document.getElementById('password');
let viewPassword = document.getElementById('viewPassword');
let click = false;

viewPassword.addEventListener('click', (e) => {
    e.preventDefault();
    if (!click) {
        password.type = 'text'
        click = true
        if (viewPassword.value == '🔒︎')
            viewPassword.value = '🔓︎';
    } else if (click) {
        password.type = 'password'
        click = false
        if (viewPassword.value == '🔓︎')
            viewPassword.value = '🔒︎';
    }
})

let password2 = document.getElementById('password2');
let viewPassword2 = document.getElementById('viewPassword2');
let click2 = false;

viewPassword2.addEventListener('click', (e) => {
    e.preventDefault();
    if (!click2) {
        password2.type = 'text'
        click2 = true
        if (viewPassword2.value == '🔒︎')
            viewPassword2.value = '🔓︎';
    } else if (click2) {
        password2.type = 'password'
        click2 = false
        if (viewPassword2.value == '🔓︎')
            viewPassword2.value = '🔒︎';
    }
})