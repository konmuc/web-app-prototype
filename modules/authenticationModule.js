class AuthenticationModule extends Module {
    constructor(sandbox, options) {
        super(sandbox)
        this.$ = {
            login: document.querySelector('section.login'),
            signIn: document.querySelector('section.login').querySelector('#aSignIn'),
            signUp: document.querySelector('section.login').querySelector('#aSignUp'),
            signOut: document.querySelector('section.login').querySelector('#aSignOut'),
        }

        this.$.signOut.addEventListener('click', event => {
            this.publish('sign-out')
        })

        this.subscribe('signed-up', _ => {
            // Redirect to sign-in
            window.location = '#/sign-in'
        })
        this.subscribe('signed-in', _ => {
            this.setVisibility('signIn', false)
            this.setVisibility('signUp', false)
            this.setVisibility('signOut', true)

            // Redirect to feed
            window.location = '#/feed'
        })
        this.subscribe('signed-off', _ => {
            this.setVisibility('signIn', true)
            this.setVisibility('signUp', true)
            this.setVisibility('signOut', false)

            // Redirect to sign-in
            window.location = '#/sign-in'
        })
    }

    setVisibility(buttonName, isVisible) {
        let button = this.$[buttonName]

        if (button) {
            if (!isVisible) {
                button.setAttribute('hidden', isVisible)
            } else {
                button.removeAttribute('hidden')
            }
        } else {
            console.error('AuthenticationModule::setVisibility:', `The input or label with the name '${buttonName}' does not exist.`)
        }
    }
}