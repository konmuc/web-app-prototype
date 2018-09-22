class ApiModule extends Module {
    constructor(sandbox) {
        super(sandbox)
        this.api = new API()
        this.api.onLoginStateChange = this._onLoginStateChange.bind(this)
        this.api.onInfoMessage = this._onInfoMessage.bind(this)

        // Setup event handlers
        this.subscribe('sign-up',  this.signUp)
        this.subscribe('sign-in',  this.signIn)
        this.subscribe('sign-out', this.signOut)

        this.subscribe('get-feed', this.getFeed)
        this.subscribe('post',     this.sendPost)
    }

    _onLoginStateChange({ loginState, username }) {
        if (loginState) {
            this.publish('signed-in', username)
            this.publish('success', `You (${username}) successfully logged into 'KonGeoS Web App Prototype'!`)
        } else {
            this.publish('signed-off', username)
        }
    }

    _onInfoMessage({ type, message }) {
        this.publish(type, message)
    }

    signUp({ username, firstname, lastname, password }) {
        this.api.signUp({ username, firstname, lastname, password })
    }

    signIn({ username, password }) {
        this.api.signIn({ username, password })
            .catch(signInError => {
                this.publish('error', signInError)
            })
    }

    signOut() {
        this.api.signOut()
    }

    updateToken() {

    }

    getFeed() {
        this.api.getPosts()
            .then(posts => {
                this.publish('feed', posts)
            })
    }

    sendPost(data) {
        let content = {
            text: data.text,
            metadata: {
                date: Date.now(),
                image: data.img ? data.img : null,
                geolocation: {
                    lat: data.geolocation && data.geolocation.lat ? data.geolocation.lat : NaN,
                    lon: data.geolocation && data.geolocation.lon ? data.geolocation.lon : NaN,
                }
            }
        }
        this.api.post(content)
    }
}