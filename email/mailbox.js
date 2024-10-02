const RegistrationEmail = (name = 'Алина') => {
    let subject = 'Создание аккаунта на NSTU WEB'
    let html = `
        <div>
            <h1>Вы успешно прошли регистрацию в NSTU WEB, ${name}!</h1>
            <p>Заполняйте данные в личном кабинете и наслаждайтесь платформой.</p>
        </div>
    `
    
    return {subject, html}
}  

const PasswordChangeEmail = (name = 'Алина') => {
    let subject = 'Обновлён пароль в NSTU WEB | Безопасность'

    let html = `
        <div>
            <h1>Уважаемый пользователь ${name}, ваш пароль к аккаунту на NSTU WEB был обновлён</h1>
            <p>Если это были не вы, то обратитесь за сбросом пароля в деканат вашего факультета.</p>
        <div>
    `

    return {subject, html}
}

module.exports = {RegistrationEmail, PasswordChangeEmail}