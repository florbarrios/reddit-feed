// fetch data

let apiData;

const getReddit = async () => {
    let response = await fetch('https://www.reddit.com/top.json?limit=50');
    apiData = await response.json();
    return apiData;
};

getReddit()
.then(apiData => renderData(apiData));

// check url type

function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
};

// individual post creation

const generatePostDOM = function generatePostDOM(title, image, author, key, seen) {
    const feedList = document.getElementById('list');

    const postItem = document.createElement('li');
    feedList.appendChild(postItem);

    const seenMarker = document.createElement('p');
    if (seen === true) {
        seenMarker.setAttribute('class', 'marker-new');
        seenMarker.setAttribute('class', 'marker-seen');
    } else {
        seenMarker.setAttribute('class', 'marker-new');
        seenMarker.setAttribute('id', `marker-${key}`);
    };
    postItem.appendChild(seenMarker);
    
    const postTitle = document.createElement('h3');
    postTitle.innerHTML = title;
    postTitle.setAttribute('class', 'preview-post-title');
    postItem.appendChild(postTitle);

    if (checkURL(image) === true) {
        const postImage = document.createElement('img');
        postImage.setAttribute('src', image);
        postImage.setAttribute('class', 'preview-post-img');
        postItem.appendChild(postImage);
    } else {
        const postURL = document.createElement('a');
        postURL.innerHTML = 'Click to open resource in a new tab';
        postURL.setAttribute('href', image);
        postURL.setAttribute('target', '_blank');
        postURL.setAttribute('class', 'url-resource');
        postItem.appendChild(postURL);
    };

    const postAuthor = document.createElement('p');
    postAuthor.innerHTML = author;
    postAuthor.setAttribute('class', 'preview-post-author');
    postItem.appendChild(postAuthor);

    const expandButton = document.createElement('button');
    expandButton.innerHTML = 'Expand';
    expandButton.setAttribute('onclick', `expandPost(${key})`);
    postItem.appendChild(expandButton);

    const dismissButton = document.createElement('button');
    dismissButton.innerHTML = 'Dismiss';
    dismissButton.setAttribute('onclick', `dismissPost(${key})`);
    postItem.appendChild(dismissButton);
};

const renderData = function renderData(data) {
    // wipe out div
    const feedList = document.getElementById('list');
    feedList.innerHTML = "";
    //populate div
    data.data.children.forEach(function (item, index) {
        item.key = index;
        item.seen;
        generatePostDOM(item.data.title, item.data.url, item.data.author, item.key, item.seen);
    })
};

// dismiss button

const dismissPost = function dismissPost(index) {
    apiData.data.children.splice(index, 1);
    renderData(apiData);

    // wipe out div
    const fullView = document.getElementById('full-view');
    fullView.innerHTML = "";
};

// expand post

const expandPost = function expandPost(key) {
    // wipe out div
    const fullView = document.getElementById('full-view');
    fullView.innerHTML= "";

    // identify post
    const post = apiData.data.children[key];

    // populate div
    const postTitle = document.createElement('h3');
    postTitle.innerHTML = post.data.title;
    fullView.appendChild(postTitle);

    if (checkURL(post.data.url) === true) {
        const postImage = document.createElement('img');
        postImage.setAttribute('src', post.data.url);
        postImage.setAttribute('class', 'preview-post-img');
        fullView.appendChild(postImage);
    } else {
        const postURL = document.createElement('a');
        postURL.innerHTML = 'Click to open resource in new tab';
        postURL.setAttribute('href', post.data.url);
        postURL.setAttribute('target', '_blank');
        postURL.setAttribute('class', 'url-resource');
        fullView.appendChild(postURL);
    };

    const postAuthor = document.createElement('p');
    postAuthor.innerHTML = post.data.author;
    fullView.appendChild(postAuthor);

    // scroll to top
    window.scrollTo(0,0);

    // seen marker handler
    post.seen = true;
    const marker= document.getElementById(`marker-${key}`);
    marker.setAttribute('class', 'marker-seen');
};
