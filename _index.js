let core = new Core()
let apiModule = new ApiModule(core)

let kongeosApi = new API()

const signUpForm = document.querySelector('.sign-up-form')
const signInForm = document.querySelector('.sign-in-form')
const userProfileForm = document.querySelector('.user-profile-form')
const secUsers = document.querySelector('#secUsers')
const btnUsersUpdate = document.querySelector('#btnUsersUpdate')
const infoField = document.querySelector('.info-field')
const feed = document.querySelector('.feed')

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

    // Post init
    switchView('feed')
}
init()

function switchView(viewName) {
    // Switch view
    Array.from(document.querySelectorAll('.view'))
        .forEach(view => {
            if (view.getAttribute('name').toLowerCase() === viewName.toLowerCase()) {
                view.style.display = 'initial'
                view.removeAttribute('hidden')
            } else {
                view.setAttribute('hidden', true);
                view.style.display = 'none'
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

kongeosApi.onInfoMessage = (message, severity) => {
    infoField.innerHTML = message
    infoField.classList.toggle(severity)
}

signUpForm.addEventListener('submit', event => {
    event.preventDefault()

    // Get variables
    let username = document.querySelector('.sign-up-form > #inUsername-sign-up').value
    let firstname = document.querySelector('.sign-up-form > #inFirstname').value
    let lastname = document.querySelector('.sign-up-form > #inLastname').value
    let password = document.querySelector('.sign-up-form > #inPassword-sign-up').value

    console.log('Signing up user with', { username, firstname, lastname, password })

    kongeosApi.signUp({ username, firstname, lastname, password })
        .then(data => {
            console.log(data)
        })
})

signInForm.addEventListener('submit', event => {
    event.preventDefault()

    // Get variables
    let username = document.querySelector('.sign-in-form > #inUsername-sign-in').value
    let password = document.querySelector('.sign-in-form > #inPassword-sign-in').value

    console.log('Signing in user with', { username, password })

    kongeosApi.signIn({ username, password })
        .then(data => {
            console.log(data)
        })
})

userProfileForm.addEventListener('submit', event => {
    event.preventDefault()

    // Get variables
    let gender = document.querySelector('.user-profile-form > #inGender').value
    let motto = document.querySelector('.user-profile-form > #inMotto').value
    let university = document.querySelector('.user-profile-form > #inUniversity').value

    console.log('Updating user profile with', { gender, motto, university })

    kongeosApi.userProfile({ gender, motto, university })
        .then(data => {
            console.log(data)
        })
})

btnUsersUpdate.addEventListener('click', event => {
    kongeosApi.users()
        .then(users => {
            Object.keys(users).forEach(username => {
                let user = users[username]
                let details = document.createElement('details')
                let summary = document.createElement('summary')
                let code = document.createElement('code')
                let pre = document.createElement('pre')

                summary.innerText = username
                details.appendChild(summary)
                pre.innerText = JSON.stringify(user, null, 2)
                code.appendChild(pre)
                details.appendChild(code)
                secUsers.appendChild(details)
            })
        })
})

setTimeout(_ => {
    kongeosApi.getPosts().then(posts => {
        console.log(posts)
        Object.keys(posts).forEach(postId => {
            const post = posts[postId]

            let article = document.createElement('pre')
            article.innerHTML = JSON.stringify(post, null, 2)

            feed.appendChild(article)
        })
    })
}, 10000)