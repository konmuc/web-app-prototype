class Module {
    constructor(sandbox) {
        this.sandbox = sandbox

        this.unsubscribe = sandbox.unsubscribe.bind(sandbox)
        this.publish     = sandbox.publish.bind(sandbox)

        this.$ = {}
    }

    subscribe(eventName, callback) {
        this.sandbox.subscribe(eventName, callback, this)
    }
}