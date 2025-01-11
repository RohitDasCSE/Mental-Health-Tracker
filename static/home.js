// Current Date
const dateElement = document.getElementById('current-date');
const today = new Date().toLocaleDateString('en-GB');
const video = document.getElementById("background-video");
const muteButton = document.getElementById("mute-button");
const changeBG = document.getElementById("change-bg");
const hideChangeBG = document.getElementById("hide-change-bg");
const showChangeBG = document.getElementById("show-change-bg");


// Mood Tracker
document.querySelectorAll('.emoji').forEach((emoji) => {
    emoji.addEventListener('click', () => {
        const mood = emoji.dataset.mood || null;
        const energy = emoji.dataset.energy || null;
        const sleepHours = document.getElementById('sleep-hours').value || null;

        const data = {
            mood: mood,
            energy: energy,
            sleepHours: sleepHours,
            timestamp: new Date().toISOString()
        };

        fetch('/save-stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
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
