document.querySelector('#signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    
    const result = await response.json();
    alert(result.message);
    if (response.ok){
        window.location.href = '/home';
    }
});

document.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    const result = await response.json();
    alert(result.message);
    if (response.ok) {
        localStorage.setItem('token', result.token);
        window.location.href = '/home';
    }
});


const container = document.querySelector('.container');
const signupButton = document.querySelector('.signup-section header');
const loginButton = document.querySelector('.login-section header');
const video = document.getElementById("background-video");
const muteButton = document.getElementById("mute-button");
const changeBG = document.getElementById("change-bg");
const hideChangeBG = document.getElementById("hide-change-bg");
const showChangeBG = document.getElementById("show-change-bg");


loginButton.addEventListener('click', () => {
    container.classList.add('active');
});

signupButton.addEventListener('click', () => {
    container.classList.remove('active');
});

muteButton.addEventListener("click", () => {
    if (video.muted) {
        video.muted = false;
        muteButton.textContent = "Mute";
    } else {
        video.muted = true;
        muteButton.textContent = "Unmute";
    }
});

document.querySelectorAll('#change-bg ul li').forEach((item) => {
    item.addEventListener('click', (e) => {
        const videoSrc = e.target.dataset.video;
        video.src = `/static/${videoSrc}`; // Update video source
        video.play(); // Play the new video 
    });
});


hideChangeBG.addEventListener('click', () => {
    changeBG.classList.add('hidden');
    showChangeBG.style.display = 'block';
});

showChangeBG.addEventListener('click', () => {
    changeBG.classList.remove('hidden');
    showChangeBG.style.display = 'none'; 
});
