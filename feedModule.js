class FeedModule extends Module {
    constructor (sandbox, options) {
        super(sandbox)

        this.$ = {
            feedContainer: document.querySelector('.feed')
        }

        this.subscribe('signed-in', _ => {
            this.publish('get-feed')
        })
        this.subscribe('feed', this.onFeedUpdate)
    }

    onFeedUpdate(posts) {
        Object.keys(posts)
            .sort((postIdA, postIdB) => {
                let postA = posts[postIdA]
                let postB = posts[postIdB]

                if (postA.content.metadata.date > postB.content.metadata.date) {
                    return -1
                } else if (postA.content.metadata.date < postB.content.metadata.date) {
                    return 1
                } else {
                    return 0
                }
            })
            .forEach(postId => {
                let post = posts[postId]
                this.renderPost(post)
            })
    }

    renderPost (post) {
        let article        = document.createElement('article')
        let header         = document.createElement('header')
        let asideLeft      = document.createElement('aside')
        let main           = document.createElement('main')
        let asideRight     = document.createElement('aside')
        let footer         = document.createElement('footer')
        let content        = document.createElement('p')
        let user           = document.createElement('a')
        let userImg        = document.createElement('img')
        let votesContainer = document.createElement('div')
        let upVotes        = document.createElement('span')
        let btnUpVotes     = document.createElement('button')
        let downVotes      = document.createElement('span')
        let btnDownVotes   = document.createElement('button')
        let votes          = document.createElement('span')
        let time           = document.createElement('span')
        let comments       = document.createElement('a')
        let geolocation    = document.createElement('a')

        article.id = post._id
        
        article.appendChild(header)

        asideLeft.className = 'left'
        article.appendChild(asideLeft)
        
        article.appendChild(main)
        
        asideRight.className = 'right'
        article.appendChild(asideRight)

        article.appendChild(footer)


        user.innerText = post.username
        user.href      = '#' + post.username
        user.className = 'user-info'
        header.appendChild(user)

        votesContainer.className = 'votes'
        asideRight.appendChild(votesContainer)
        
        btnUpVotes.innerText = '^'
        votesContainer.appendChild(btnUpVotes)
        
        upVotes.innerText = post.votes.upvotes.length
        upVotes.className = 'votes-value'
        upVotes.hidden = true
        votesContainer.appendChild(upVotes)
        
        votes.innerText = post.votes.downvotes.length + post.votes.upvotes.length
        votesContainer.appendChild(votes)
        
        downVotes.innerText = post.votes.downvotes.length
        downVotes.className = 'votes-value'
        downVotes.hidden = true
        votesContainer.appendChild(downVotes)
        
        btnDownVotes.innerText = 'v'
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
        footer.appendChild(comments)

        // Geolocation
        geolocation.innerText = `${post.content.metadata.geolocation.lat} ${post.content.metadata.geolocation.lon}`
        geolocation.className = 'geolocation'
        footer.appendChild(geolocation)

        // article.innerHTML = '<pre>' + JSON.stringify(post, null, 2) + '</pre>'

        this.$.feedContainer.appendChild(article)
    }

    _formatTimeAgo(epochs) {
        let dateDiff = Date.now() - epochs

        const second = 1000
        const minute = second * 60
        const hour   = minute * 60
        const day    = hour * 24

        let days    = Math.floor(dateDiff / day)
        let hours   = Math.floor((dateDiff - days * day) / hour)
        let minutes = Math.floor((dateDiff - days * day - hours * hour) / minute)
        let seconds = Math.floor((dateDiff - days * day - hours * hour - minutes * minute) / second)

        return (days > 0 ? `${days}d ` : '')
            + (days > 0 || hours > 0 ? `${hours}h ` : '')
            + (days > 0 || hours > 0 || minutes > 0 ? `${minutes}m ` : '')
            + (days > 0 || hours > 0 || minutes > 0 || seconds > 0 ? `${seconds}s` : '')
    }
}