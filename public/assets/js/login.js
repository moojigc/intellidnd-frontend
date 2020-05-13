const $returnLoginBtn = $('.return-login');
const playerId = localStorage.getItem('id'); 

function getLogin() {
    if (!!playerId) {
        $returnLoginBtn.show()
        if (window.location.pathname === `/login/${playerId}`) {
            $returnLoginBtn.hide()
        }
    } else {
        $returnLoginBtn.hide();
    }
}

function redirect() {
    window.location.replace(`/login/${localStorage.getItem('id')}`);
}

getLogin();
$returnLoginBtn.on('click', redirect);

