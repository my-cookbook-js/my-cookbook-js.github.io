import { register, verifyEmail } from '../api/user.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../utils.js';
import { errorMsg, field } from './common.js';


const registerTemplate = (onSubmit, errors, data) => html`
<section id="register">
    <article>
        <h2>Регистрация</h2>
        <form @submit=${onSubmit} id="loginForm">
            ${errorMsg(errors)}

            ${field({label: 'Потребител', name: 'username', placeholder: 'Потребителско име', value: data.username, error: errors.username})}
            ${field({label: 'E-mail', name: 'email', placeholder: 'e-mail', value: data.email, error: errors.email})}
            ${field({label: 'Парола', type: 'password', name: 'password', placeholder: 'Паролата трябва да съдържа поне 8 символа', error: errors.password})}
            ${field({label: 'Повторение', type: 'password', name: 'repass', placeholder: 'Повторете паролата', error: errors.repass})}
            <input type="submit" value="Регистрация">
        </form>
    </article>
</section>`;

export function registerPage(ctx) {
    update();
    
    function update(errors = {}, data = {}) {
        ctx.render(registerTemplate(createSubmitHandler(onSubmit, 'username', 'email', 'password', 'repass'), errors, data));
    }
    
    async function onSubmit(data, event) {
        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '');

            if (missing.length > 0) {
                throw missing
                .reduce((acc, [k]) => Object.assign(acc, {[k]: true}), {message: 'Моля попълнете всички полета.'});
            }
            if (data.password.length < 8) {
                throw {
                    message: 'Паролата трябва да съдържа поне 8 символа.',
                    password: true,
                    repass: true
                };
            }
            if (data.password != data.repass) {
                throw {
                    message: 'Паролите не съвпадат.',
                    password: true,
                    repass: true
                };
            }

            await register(data.username, data.email, data.password);
            await verifyEmail({email: data.email});

            event.target.reset();
            ctx.updateUserNav();
            ctx.updateSession();
            ctx.notify('Ще получите email с линк за потвърждение на регистрацията.');
            ctx.page.redirect('/recipes');

        } catch (err) {
            update(err, data);
        }
    }
}

