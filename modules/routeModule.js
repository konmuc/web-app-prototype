class RouteModule extends Module {
    constructor(sandbox, options) {
        super(sandbox)

        window.addEventListener('hashchange', event => {
            let locationHash = location.hash.substring(2)
            this.publish('location-change', locationHash)
        })
    }
}