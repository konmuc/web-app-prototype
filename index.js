let core = new Core()

core.register('back-button', BackButtonModule)
core.register('logging-gui', GuiLoggingModule)
core.register('router',      RouteModule)
core.register('api',         ApiModule)
core.register('sign',        SignFormModule)
core.register('auth',        AuthenticationModule)
core.register('feed',        FeedModule)
core.register('post',        PostModule)
core.register('post-feed',   PostFeedModule)

core.startModules()
window.core = core

// Other stuff
function init() {
    Array.from(document.querySelectorAll('.view-switch'))
        .forEach(label => {
            let radio = document.querySelector(`input[type=radio]#${label.getAttribute('for')}`)

            if (radio) {
                radio.addEventListener('change', (event) => {
                    switchView(radio.value)
                })
            }
        })

        core.subscribe('location-change', locationHash => {
            let baseLocation = locationHash.split('/')[0]
            switchView(baseLocation)
        })

    // Post init
    location.hash = '#/sign-in'
}
init()

function switchView(viewName) {
    // Switch view
    Array.from(document.querySelectorAll('.view'))
        .forEach(view => {
            if (view.getAttribute('name').toLowerCase() === viewName.toLowerCase()) {
                // view.style.display = 'initial'
                view.removeAttribute('hidden')
            } else {
                view.setAttribute('hidden', true);
                // view.style.display = 'none'
            }
        })

    // Update radio button
    Array.from(document.querySelectorAll('.view-switch'))
        .forEach(label => {
            let radio = document.querySelector(`input[type=radio]#${label.getAttribute('for')}`)

            if (radio.value.toLowerCase() === viewName.toLowerCase() && !radio.getAttribute('checked')) {
                radio.setAttribute('checked', true)
            }
        })
}