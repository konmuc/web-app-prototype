class GuiLoggingModule extends Module {
    constructor(sandbox, options) {
        super(sandbox)
        this.$ = {
            infoField: document.querySelector('.info-field')
        }

        // Subscriptions
        this.subscribe('error',   this.onError)
        this.subscribe('warning', this.onWarning)
        this.subscribe('info',    this.onInfo)
        this.subscribe('success', this.onSuccess)
    }
    
    onError(message) {
        this.$.infoField.innerText = message
        this.$.infoField.classList.add('error')
        this._hide()
    }
    
    onWarning(message) {
        this.$.infoField.innerText = message
        this.$.infoField.classList.add('warning')
        this._hide()
    }
    
    onInfo(message) {
        this.$.infoField.innerText = message
        this.$.infoField.classList.add('info')
        this._hide()
    }

    onSuccess(message) {
        this.$.infoField.innerText = message
        this.$.infoField.classList.add('success')
        this._hide()
    }

    _hide() {
        setTimeout(_ => {
            this.$.infoField.innerText = ''
            this.$.infoField.className = 'info-field'
        }, 5000)
    }
}