class PostModule extends Module {
    constructor(sandbox, options) {
        super(sandbox)

        this.$.inPost  = document.querySelector('#inPost')
        this.$.btnPost = document.querySelector('#btnPost')

        this.$.btnPost.addEventListener('click', event => {
            this.publish('post', { text: this.$.inPost.value })
        })
    }
}