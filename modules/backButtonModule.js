class BackButtonModule extends Module {
    constructor(sandbox, options) {
        super(sandbox);
        this.$.btnBack = document.querySelector('#btnBack')

        window.addEventListener('hashchange', this.onHashChange.bind(this))
        this.onHashChange()
    }

    onHashChange() {
        let locationHash = location.hash.substring(2)
        if (
            locationHash === 'feed'
            || locationHash === 'sign-in'
            || locationHash === 'sign-up'
        ) {
            this.$.btnBack.setAttribute('hidden', true)
        } else {
            this.$.btnBack.removeAttribute('hidden')
        }
    }
}