function login() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    axios.post('https://tarmeezacademy.com/api/v1/login', {
        "email": email,
        "password": password,
        "username": name,
    })
    .then(function(response) {
        const user = response.data.user;
        const token = response.data.token;

        // Handle the profile image
        const profileImage = user.profile_image && user.profile_image !== '{}' ? user.profile_image : null;

        // Store the user data and token in localStorage
        localStorage.setItem("token", token);
        user.profile_image = profileImage; // Set profile image
        localStorage.setItem("user", JSON.stringify(user));

        window.location.assign("../home/index.html");
    })
    .catch(function(error) {
        window.alert(error.response.data.error);
    });
}


function signup() {
    let Uname = document.getElementById("UserName").value;
    let name = document.getElementById("newename").value;
    let email = document.getElementById("newemail").value;
    let password = document.getElementById("newpassword").value;
    let image = document.getElementById("images").files[0];

    // Log data to make sure everything is being captured
    console.log("Username: ", Uname);
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Image file: ", image);

    // Create FormData object to handle file uploads
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', Uname);
    formData.append('name', name);
    formData.append('image', image);

    // Log formData values to ensure it contains correct information
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    // Make sure to use the correct signup endpoint
    axios.post('https://tarmeezacademy.com/api/v1/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(function(response) {
        console.log("start");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("go");
        window.location.assign("../home/index.html");
    })
    .catch(function(error) {
        console.error("Error:", error); // Log the actual error
        if (error.response && error.response.data && error.response.data.error) {
            window.alert(error.response.data.error);
        } else {
            window.alert("An unexpected error occurred.");
        }
    });
}




document.getElementById("signup").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission or default behavior

    let image = document.getElementById("image");
    let im = document.getElementById("im");
    let cent = document.getElementsByClassName("cent")[0];
    let log = document.getElementsByClassName("login")[0];
    let well = document.getElementsByClassName("welcome")[0];
    let center = document.getElementsByClassName("center")[0];

    image.style.display = "none";
    center.style.display = "none";
    im.style.display = "block";
    cent.style.display = "block";
    well.style.borderRadius = "100px 0 0 100px";
    well.style.backgroundColor = "#272343";
    log.style.backgroundColor = "white";
});

document.getElementById("signup").addEventListener("click", function(event) {
    event.preventDefault(); 

    let image = document.getElementById("image");
    let im = document.getElementById("im");
    let login = document.getElementsByClassName("login")[0];
    let welcome = document.getElementsByClassName("welcome")[0];
    let cent = document.getElementsByClassName("cent")[0];

    const originalStyles = {
        welcomeDisplay: welcome.style.display,
        welcomeWidth: welcome.style.width,
        welcomeBorderRadius: welcome.style.borderRadius,
        centPaddingLeft: cent.style.paddingLeft,
        loginDisplay: login.style.display,
        imageDisplay: image.style.display,
        imDisplay: im.style.display
    };

    function applyResponsiveStyles() {
        if (window.matchMedia("(max-width: 700px)").matches) {
            
            welcome.style.display = "block";
            welcome.style.backgroundColor = "#272343";
            welcome.style.width = "100%";
            welcome.style.borderRadius = "0px";
            cent.style.paddingLeft = "20%";

            login.style.display = "none";  
            image.style.display = "none";  
            im.style.display = "none";  
        } else {
            // Restore original values
            welcome.style.display = originalStyles.welcomeDisplay;
            welcome.style.width = originalStyles.welcomeWidth;
            welcome.style.borderRadius = originalStyles.welcomeBorderRadius;
            cent.style.paddingLeft = originalStyles.centPaddingLeft;

            login.style.display = originalStyles.loginDisplay;
            image.style.display = originalStyles.imageDisplay;
            im.style.display = originalStyles.imDisplay;
        }
    }

    // Apply responsive styles on click
    applyResponsiveStyles();

    // Add resize event listener to check screen size on window resize
    window.addEventListener('resize', applyResponsiveStyles);
});

