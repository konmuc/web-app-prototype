class AuthenticationModule extends Module {
    constructor(sandbox, options) {
        super(sandbox)
        this.$ = {
            login: document.querySelector('section.login'),
            signIn: document.querySelector('section.login').querySelector('#radSignIn'),
            signInLabel: document.querySelector('section.login').querySelector('label[for=radSignIn]'),
            signUp: document.querySelector('section.login').querySelector('#radSignUp'),
            signUpLabel: document.querySelector('section.login').querySelector('label[for=radSignUp]'),
            signOut: document.querySelector('section.login').querySelector('#radSignOut'),
            signOutLabel: document.querySelector('section.login').querySelector('label[for=radSignOut]'),
        }

        this.$.signOut.addEventListener('click', event => {
            this.publish('sign-out')
        })

        this.subscribe('signed-in', _ => {
            this.setVisibility('signIn', false)
            this.setVisibility('signUp', false)
            this.setVisibility('signOut', true)
        })
        this.subscribe('signed-off', _ => {
            this.setVisibility('signIn', true)
            this.setVisibility('signUp', true)
            this.setVisibility('signOut', false)
        })
    }

    setVisibility(buttonName, isVisible) {
        let button = this.$[buttonName]
        let buttonLabel = this.$[`${buttonName}Label`]

        if (button && buttonLabel) {
            if (!isVisible) {
                button.setAttribute('hidden', isVisible)
                buttonLabel.setAttribute('hidden', isVisible)
            } else {
                button.removeAttribute('hidden')
                buttonLabel.removeAttribute('hidden')
            }
        } else {
            console.error('AuthenticationModule::setVisibility:', `The input or label with the name '${buttonName}' does not exist.`)
        }
    }
}