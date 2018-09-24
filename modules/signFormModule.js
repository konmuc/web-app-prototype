class SignFormModule extends Module {
    constructor (sandbox, options) {
        super(sandbox)
        this.$ = {
            signUpForm:  document.querySelector('.sign-up-form'),
            signInForm:  document.querySelector('.sign-in-form')
        }

        this.$.signUpForm.addEventListener('submit', e => this.onSignUpSubmit(e))
        this.$.signInForm.addEventListener('submit', e => this.onSignInSubmit(e))
    }

    onSignUpSubmit(event) {
        event.preventDefault()
        let username  = this.$.signUpForm.querySelector('input#inUsername-sign-up').value
        let firstname = this.$.signUpForm.querySelector('input#inFirstname').value
        let lastname  = this.$.signUpForm.querySelector('input#inLastname').value
        let password  = this.$.signUpForm.querySelector('input#inPassword-sign-up').value
    
        this.publish('sign-up', { username, firstname, lastname, password })
    }
    
    onSignInSubmit(event) {
        event.preventDefault()
        let username = this.$.signInForm.querySelector('input#inUsername-sign-in').value
        let password = this.$.signInForm.querySelector('input#inPassword-sign-in').value

        this.publish('sign-in', { username, password })
    }
}
