import { getUserData } from '../utils.js';
import { logout } from '../api/user.js';


export default function initialize() {
    let user = null;
    let _ctx = null;
    document.getElementById('logoutBtn').addEventListener('click', onLogout);
    updateSession();

    return function (ctx, next) {
        ctx.updateSession = updateSession;
        ctx.user = user;
        _ctx = ctx;

        next();
    };

    function updateSession() {
        user = getUserData();
    }
        
    function onLogout() {
        logout();
        updateSession();
        _ctx.updateUserNav();
        _ctx.page.redirect('/');
    }
}
