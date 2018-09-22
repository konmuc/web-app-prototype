class Core {
    constructor() {
        this.modules = {}
        this.eventCache = {}
    }

    register (moduleName, moduleClass, options) {
        this.modules[moduleName] = { class: moduleClass, options }
    }

    unregister (moduleName) {
        delete this.modules[moduleName].instance
    }

    startModule (moduleName) {
        try {
            this.modules[moduleName].instance = new this.modules[moduleName].class(this, this.modules[moduleName].options)
        } catch (startModuleError) {
            console.error('Core::startModule', `Unable to start the module '${moduleName}', due to the following error.`, startModuleError)
        }
    }

    startModules () {
        Object.keys(this.modules).forEach(moduleName => this.startModule(moduleName))
    }

    publish (eventName, data) {
        if (this.eventCache[eventName]) {
            this.eventCache[eventName].forEach(({callback, creator}) => {
                try {
                    callback.bind(creator)(data)
                } catch (callbackError) {
                    console.error('ERROR::Publish', 'Error occured in callback', callbackError)
                }
            })
        }
    }

    subscribe (eventName, callback, creator) {
        if (!this.eventCache[eventName]) {
            this.eventCache[eventName] = []
        }

        this.eventCache[eventName].push({ callback, creator })
    }

    unsubscribe (eventName, callback) {
        let index = this.eventCache[eventName].indexOf(callback)

        if (index != -1) {
            this.eventCache[eventName].splice(index, 1)
        }
    }
}