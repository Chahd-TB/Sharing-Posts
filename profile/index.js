let currentPage = 1;
let isLoading = false;

function loadPosts(page) {
    isLoading = true;
    axios.get(`https://tarmeezacademy.com/api/v1/posts?page=${page}`)
    .then((response) => {
        const posts = response.data.data;
        let content = document.getElementsByClassName("content")[0];
        const user = JSON.parse(localStorage.getItem("user"));
        
        for (let post of posts) {
            if (user.username === post.author.username && user.email === post.author.email && user.id === post.author.id) {
                content.innerHTML += 
                `
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
                                <div class="updating">
                                    <p onclick="dell(${post.id})"><span class="material-symbols-outlined">delete</span></p>
                                    <p onclick="edit(${post.id})"><span class="material-symbols-outlined">draw</span></p>
                                </div>
                                <h3>${post.title}</h3>
                                <p>${post.body}</p>
                            </div>
                            <div class="comments" onclick="postClick(${post.id})">
                                <p><span class="material-symbols-outlined">edit</span> (${post.comments_count}) comments</p>
                            </div>
                            <span id="ex" class="close">&times;</span>
                            <div class="send">
                                <input type="text" placeholder="comment" id="comenting">
                                <button onclick="commentCreate(${post.id})">send</button>
                            </div>
                            <div class="com">
                                <!-- Comments will be inserted here -->
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        isLoading = false;
    })
    .catch((error) => {
        console.error('Error fetching posts:', error);
        isLoading = false;
    });
}

// Listen for scroll event
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading) {
        currentPage++;
        loadPosts(currentPage); // Load the next page of posts
    }
});

// Load the first page initially
loadPosts(currentPage);

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


function edit(postId) {
    const posting = document.getElementsByClassName("posting")[0];
    const box = document.getElementsByClassName("box")[0];
    const overlays = document.getElementsByClassName("overlay")[0];
    const postButton = document.getElementById("post");
    const exitButton = document.getElementById("exit");

    overlays.style.display = "block";
    posting.style.display = "block";
    box.style.display = "block";

        let formData = new FormData();
        formData.append("image", document.getElementById("file").files[0]);
        formData.append("title", document.getElementById("title").value);
        formData.append("body", document.getElementById("text").value);

       postButton.addEventListener("click", function(){
        axios.put(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(function(response) {
            overlays.style.display = "none";
            posting.style.display = "none";
            box.style.display = "none";

            const postElement = document.querySelector(`.post[data-id="${postId}"]`);
            if (postElement) {
                postElement.querySelector('h3').textContent = response.data.data.title;
                postElement.querySelector('.paragraphe p').textContent = response.data.data.body;
                const postImage = postElement.querySelector('.image img');
                postImage.src = response.data.data.image || postImage.src;
            }
            console.log("done")
        })
        .catch(function(error) {
            console.error("Error updating the post:", error);
        });

        exitButton.addEventListener("click", function() {
            overlays.style.display = "none";
            posting.style.display = "none";
        });
       })
}


function dell(postId) {
    const overlays = document.getElementsByClassName("overlay")[0];
    const deleting = document.getElementsByClassName("deleting")[0];
    const boxing = document.getElementsByClassName("boxing")[0];
    overlays.style.display = "block";
    deleting.style.display = "block";
    boxing.style.display = "block";

    document.getElementById("yes").addEventListener("click", function() {

        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(function(response) {
            overlays.style.display = "none";
            deleting.style.display = "none";
            boxing.style.display = "none";

            const postElement = document.querySelector(`.post[data-id="${postId}"]`);
            if (postElement) {
                postElement.remove();
            }
        })
    });

    document.getElementById("no").addEventListener("click", function() {
        overlays.style.display = "none";
        deleting.style.display = "none";
        boxing.style.display = "none";
   });

    document.getElementById("exiting").addEventListener("click", function() {
        document.getElementsByClassName("deleting")[0].style.display = "none";
        document.getElementsByClassName("boxing")[0].style.display = "none";
        document.getElementsByClassName("overlay")[0].style.display = "none";
    });

}


document.querySelector(".content").addEventListener("click", function(event) {
    const target = event.target;

    if (target.closest(".comments")) {
        const postContainer = target.closest(".post");
        const paragraph = postContainer.querySelector(".paragraphe");
        const comments = postContainer.querySelector(".comments");
        const send = postContainer.querySelector(".send");
        const com = postContainer.querySelector(".com");
        const ex = postContainer.querySelector("#ex");

        paragraph.style.display = "none";
        comments.style.display = "none";
        send.style.display = "block";
        com.style.display = "block";
        ex.style.display = "block";
    }

    if (target.id === "ex") {
        const postContainer = target.closest(".post");
        const paragraph = postContainer.querySelector(".paragraphe");
        const comments = postContainer.querySelector(".comments");
        const send = postContainer.querySelector(".send");
        const com = postContainer.querySelector(".com");

        paragraph.style.display = "block";
        comments.style.display = "block";
        send.style.display = "none";
        com.style.display = "none";
        target.style.display = "none";
    }
});

let up = document.getElementsByClassName("up")[0];
let profile = document.getElementsByClassName("profile")[0];
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    profile.innerHTML = `<a href=""><img src="${user.profile_image}" alt="" id="ima"></a>`;
    
    // Inject initial content to the 'up' div
    up.innerHTML = `
        <div class="intro">
            <h1>hello, I'm <span>${user.username}</span></h1>
            <textarea id="bio" placeholder="write about yourself"></textarea>
            <button id="bioS">done</button>
            <p id="bioDisplay">${localStorage.getItem('userBio') || ''}</p>
            <button id="editBio">edit</button>
            <p class="numbers">posts: <span>${user.posts_count}</span></p>
            <p class="numbers">comments: <span>${user.comments_count}</span></p>
        </div>
        <div class="profile">
            <img src="${user.profile_image}" alt="">
        </div>
    `;

    const bio = document.getElementById("bio");
    const bioS = document.getElementById("bioS");
    const bioDisplay = document.getElementById("bioDisplay");
    const editBio = document.getElementById("editBio");

    // Set initial display states based on the presence of a stored bio
    if (localStorage.getItem('userBio')) {
        bio.style.display = "none";
        bioS.style.display = "none";
        bioDisplay.style.display = "block";
        editBio.style.display = "block";
    } else {
        bio.style.display = "block";
        bioS.style.display = "block";
        bioDisplay.style.display = "none";
        editBio.style.display = "none";
    }

    // Edit bio button functionality
    editBio.addEventListener("click", function () {
        bio.style.display = "block";
        bioS.style.display = "block";
        bioDisplay.style.display = "none";
        editBio.style.display = "none";
        bio.value = localStorage.getItem('userBio') || ''; // Pre-fill with existing bio
    });

    // Save bio button functionality
    bioS.addEventListener("click", function () {
        const text = bio.value.trim(); // Get the value of the textarea
        if (text !== "") {
            localStorage.setItem("userBio", text);
            bioDisplay.textContent = text;
            bio.style.display = "none";
            bioS.style.display = "none";
            bioDisplay.style.display = "block";
            editBio.style.display = "block";
        }
    });
}

 function logout() {
        axios.post('https://tarmeezacademy.com/api/v1/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "../login/login.html";
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    }