
axios.get(`https://tarmeezacademy.com/api/v1/posts`)
.then((response) => {
    const posts = response.data.data;
    let content = document.getElementsByClassName("content")[0];
    for (post of posts) {

        content.innerHTML += `<div class="post" data-id="${post.id}">
                <div class="gauche">
                    <div class="profile">
                        <img src="${post.author.profile_image}" onerror="this.src='img/yesyes.jpg'" alt="">
                        <p>${post.author.username}</p>
                    </div>
                    <div class="image">
                          <img src="${post.image}" onerror="this.src='img/elementor-placeholder-image.webp'" alt="">
                    </div>
                </div>
                <div class="droite">
                    <div class="paragraphe">
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                    </div>
                    <div class="comments" onclick ="postClick(${post.id})">
                        <p><span class="material-symbols-outlined">edit</span>(${post.comments_count}) comments</>
                    </div>
                     <span id="ex" class="close">&times;</span>
                    <div class="send">
                        <input type="text" placeholder="comment" id="comenting">
                        <button onclick="commentCreate(${post.id} )">send</button>
                    </div>
                    <div class="com">

                    </div>

                </div>
            </div>`;
            
    }


    document.getElementById("post").addEventListener("click", function(){
        const headers = {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
        };
        let formData = new FormData();
        formData.append("image", document.getElementById("file").files[0]);
        formData.append("title", document.getElementById("title").value);
        formData.append("body", document.getElementById("text").value);
    
        axios.post(`https://tarmeezacademy.com/api/v1/posts`, formData, { headers: headers })
            .then((response) => {
                window.location.reload(); 
            })
    });


let lastScrollTop = 0;
const navs = document.querySelectorAll("#scroll");

window.addEventListener("scroll", function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    navs.forEach(nav => {
        if (scrollTop > lastScrollTop) {
            nav.style.top = "-100px"; 
        } else {
            nav.style.top = "0";
        }
    });

    lastScrollTop = scrollTop;
});

// Overlay and posting display
const overlays = document.querySelectorAll(".overlay");
const postings = document.querySelectorAll(".posting");
const buttons = document.querySelectorAll(".button");

buttons.forEach((button, index) => {
    button.addEventListener("click", function() {
        overlays[index].style.display = "block";
        postings[index].style.display = "block";
    });
});


// Paragraph toggle
const paragraphContainers = document.querySelectorAll('.paragraphe');
const showMoreButtons = document.querySelectorAll('.show-more');

paragraphContainers.forEach((paragraphContainer, index) => {
    const paragraph = paragraphContainer.querySelector('#text');
    const showMore = showMoreButtons[index];

    paragraphContainer.addEventListener('click', function () {
        paragraphContainer.classList.toggle('expanded');

        if (paragraphContainer.classList.contains('expanded')) {
            showMore.textContent = 'Show less';
        } else {
            showMore.textContent = '...';
        }
    });
});

// Comments section
const commentContainers = document.querySelectorAll(".comments");
const exButtons = document.querySelectorAll("#ex");

commentContainers.forEach((commentContainer, index) => {
    const ex = exButtons[index];
    const paragraph = document.querySelectorAll(".paragraphe")[index];
    const comments = commentContainer;
    const send = document.querySelectorAll(".send")[index];
    const com = document.querySelectorAll(".com")[index];

    comments.addEventListener("click", function() {
        paragraph.style.display = "none";
        comments.style.display = "none";
        send.style.display = "block";
        com.style.display = "block";
        ex.style.display = "block";
    });

    ex.addEventListener("click", function() {
        paragraph.style.display = "block";
        comments.style.display = "block";
        send.style.display = "none";
        com.style.display = "none";
        ex.style.display = "none";
    });
});

})

document.addEventListener("DOMContentLoaded", function() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        const profile = document.getElementById("ima");
        profile.src = user.profile_image ? user.profile_image :"img/yesyes.jpg"; 
    }
});
function commentCreate(postId) {
    const commentInput = document.querySelector(`.post[data-id="${postId}"] #comenting`);
    const commentBody = commentInput.value;
    commentInput.value = ''; 
    const user = JSON.parse(localStorage.getItem("user"));

    axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`, {
        body: commentBody
    }, {
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        let comment = response.data.data;
        let commentSection = document.querySelector(`.post[data-id="${postId}"] .com`);

        commentSection.innerHTML += `
            <div class="comment">
                <div class="profile">
                    <a href=""><img src="${user.profile_image}" onerror="this.src='img/yesyes.jpg'" alt=""></a>
                </div>
                <div class="par">
                    <a href="">${user.username}</a>
                    <p>${comment.body}</p>
                    <hr>
                </div>
            </div>`;
    })
    .catch(error => {
        console.error("Error posting comment", error);
    });
}

function postClick(postId) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
    .then((response) => {
        let comments = response.data.data.comments;
        let commentSection = document.querySelector(`.post[data-id="${postId}"] .com`);
        commentSection.innerHTML = ''; 

        comments.forEach(comment => {
            commentSection.innerHTML += `
                <div class="comment">
                    <div class="profile">
                        <a href=""><img src="${comment.author.profile_image}" onerror="this.src='img/yesyes.jpg'" alt=""></a>
                    </div>
                    <div class="par">
                        <a href="">${comment.author.username}</a>
                        <p>${comment.body}</p>
                        <hr>
                    </div>
                </div>`;
        });
    })
    .catch(error => {
        console.error("Error loading comments", error);
    });
}

document.getElementById("post").addEventListener("click", function() {
    event.preventDefault();
    const headers = {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data'
    };
    let formData = new FormData();
    formData.append("image", document.getElementById("file").files[0]);
    formData.append("title", document.getElementById("title").value);
    formData.append("body", document.getElementById("text").value);
    document.getElementsByClassName("overlay")[0].style.display = "none";
    document.getElementsByClassName("posting")[0].style.display = "none";

    axios.post(`https://tarmeezacademy.com/api/v1/posts`, formData, { headers: headers })
        .then((response) => {
            let post = response.data.data;
            let content = document.getElementsByClassName("content")[0];
            content.innerHTML = `
                <div class="post" data-id="${post.id}">
                    <div class="gauche">
                        <div class="profile">
                            <img src="${post.author.profile_image}" onerror="this.src='img/yesyes.jpg'" alt="">
                            <p>${post.author.username}</p>
                        </div>
                        <div class="image">
                            <img src="${post.image}" onerror="this.src='img/elementor-placeholder-image.webp'" alt="">
                        </div>
                    </div>
                    <div class="droite">
                        <div class="paragraphe">
                            <h3>${post.title}</h3>
                            <p>${post.body}</p>
                        </div>
                        <div class="comments" onclick ="postClick(${post.id})">
                            <p><span class="material-symbols-outlined">edit</span>(${post.comments_count}) comments</p>
                        </div>
                        <span id="ex" class="close">&times;</span>
                        <div class="send">
                            <input type="text" placeholder="comment" id="comenting">
                            <button onclick="commentCreate(${post.id})">send</button>
                        </div>
                        <div class="com"></div>
                    </div>
                </div>` + content.innerHTML;
        })
});

document.getElementById("exit").addEventListener("click", function(){
    document.getElementsByClassName("overlay")[0].style.display = "none";
    document.getElementsByClassName("posting")[0].style.display = "none";
});