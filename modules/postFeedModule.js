class PostFeedModule extends Module {
    constructor(sandbox, options) {
        super(sandbox)
        this.$.postView = document.querySelector('section.view[name=post]')
        this.$.header = document.querySelector('section.view[name=post] > header')
        this.$.main = document.querySelector('section.view[name=post] > main')
        this.$.footer = {
            inComment: document.querySelector('section.view[name=post] > footer #inComment'),
            btnSendComment: document.querySelector('section.view[name=post] > footer #btnSendComment')
        }
        this.templates = {
            comment: this._templateFromString`
                <div class="comment">
                    <a class="userName">{username}</a>
                    <pre class="content">{text}</pre>
                </div>
            `
        }

        this.subscribe('post-open', data => {
            this.render(data)
        })

        this.$.footer.btnSendComment.addEventListener('click', _ => {
            if (this.$.footer.inComment.value.trim().length > 0) {
                let data = {
                    type: 'comment',
                    postId: this.$.header.id,
                    text: this.$.footer.inComment.value
                }
                this.publish('post-comment', data)
                this.$.footer.inComment.value = ''
            }
        })
    }
    render({ username, post }) {
        let article = this._renderPost({ username, post })
        this.$.header.innerHTML = article.innerHTML
        this.$.header.id = post._id
        if (post.comments) {
            this._renderComments({ username, comments: post.comments })
        }
    }

    _renderPost({ username, post }) {
        let article = document.createElement('article')
        let header = document.createElement('header')
        let asideLeft = document.createElement('aside')
        let main = document.createElement('main')
        let asideRight = document.createElement('aside')
        let footer = document.createElement('footer')
        let content = document.createElement('p')
        let user = document.createElement('a')
        let userImg = document.createElement('img')
        let votesContainer = document.createElement('div')
        let upVotes = document.createElement('span')
        let btnUpVotes = document.createElement('button')
        let downVotes = document.createElement('span')
        let btnDownVotes = document.createElement('button')
        let votes = document.createElement('span')
        let time = document.createElement('span')
        let comments = document.createElement('a')
        let geolocation = document.createElement('a')

        article.id = post._id
        article.className = 'post'

        article.appendChild(header)

        asideLeft.className = 'left'
        article.appendChild(asideLeft)

        article.appendChild(main)

        asideRight.className = 'right'
        article.appendChild(asideRight)

        article.appendChild(footer)


        user.innerText = post.username
        user.href = '#' + post.username
        user.className = 'user-info'
        header.appendChild(user)

        votesContainer.className = 'votes'
        asideRight.appendChild(votesContainer)

        if (post.votes.upvotes.indexOf(username) != -1) {
            btnUpVotes.innerText = '▲'
        } else {
            btnUpVotes.innerText = '△'
        }
        votesContainer.appendChild(btnUpVotes)

        btnUpVotes.addEventListener('click', event => {
            this.publish('post-upvote', post._id)
        })

        btnDownVotes.addEventListener('click', event => {
            this.publish('post-downvote', post._id)
        })

        upVotes.innerText = post.votes.upvotes.length
        upVotes.className = 'votes-value'
        upVotes.hidden = true
        votesContainer.appendChild(upVotes)

        votes.innerText = post.votes.upvotes.length - post.votes.downvotes.length
        votesContainer.appendChild(votes)

        downVotes.innerText = post.votes.downvotes.length
        downVotes.className = 'votes-value'
        downVotes.hidden = true
        votesContainer.appendChild(downVotes)

        if (post.votes.downvotes.indexOf(username) != -1) {
            btnDownVotes.innerText = '▼'
        } else {
            btnDownVotes.innerText = '▽'
        }
        votesContainer.appendChild(btnDownVotes)

        content.innerText = post.content.text
        content.className = 'content'
        main.appendChild(content)

        // Time ago
        time.innerText = this._formatTimeAgo(post.content.metadata.date)
        time.className = 'time'
        footer.appendChild(time)

        // Comments
        comments.innerText = `${post.comments.length}`
        comments.className = 'comments'
        comments.href = `./#/post/${post._id}`
        footer.appendChild(comments)
        comments.addEventListener('click', event => {
            this.publish('post-open', post)
        })

        // Geolocation
        geolocation.innerText = `${post.content.metadata.geolocation.lat} ${post.content.metadata.geolocation.lon}`
        geolocation.className = 'geolocation'
        footer.appendChild(geolocation)

        // article.innerHTML = '<pre>' + JSON.stringify(post, null, 2) + '</pre>'

        return article
    }

    _renderComment({ username, comment }) {
        return this.templates.comment.create({ username: comment.username, text: comment.content.text })
    }

    _renderComments({ username, comments }) {
        this.$.main.innerHTML = ''
        comments
            .forEach(comment => {
                let elementComment = this._renderComment({ username, comment })
                this.$.main.appendChild(elementComment)
            })
    }
    _formatTimeAgo(epochs) {
        let dateDiff = Date.now() - epochs

        const second = 1000
        const minute = second * 60
        const hour = minute * 60
        const day = hour * 24

        let days = Math.floor(dateDiff / day)
        let hours = Math.floor((dateDiff - days * day) / hour)
        let minutes = Math.floor((dateDiff - days * day - hours * hour) / minute)
        let seconds = Math.floor((dateDiff - days * day - hours * hour - minutes * minute) / second)

        return (days > 0 ? `${days}d ` : '')
            + (days > 0 || hours > 0 ? `${hours}h ` : '')
            + (days > 0 || hours > 0 || minutes > 0 ? `${minutes}m ` : '')
            + (days > 0 || hours > 0 || minutes > 0 || seconds > 0 ? `${seconds}s` : '')
    }

    _templateFromString(text, ...values) {
        return new Template(text)
    }
}

class Template {
    constructor(text) {
        this.template = document.createElement('template')
        this.template.innerHTML = text
    }

    create(params) {
        if (this.template.content) {
            let clone = document.importNode(this.template.content, true)

            clone.children[0].innerHTML = clone.children[0].innerHTML
                .replace(/\{(?:[^\}]+)\}/g, match => {
                    let key = match.substring(1, match.length - 1)

                    if (params[key]) {
                        return params[key]
                    }

                    return key
                })

            return clone.children[0]
        }

        let div = document.createElement('div')
        div.innerHTML = text
        return div
    }
}