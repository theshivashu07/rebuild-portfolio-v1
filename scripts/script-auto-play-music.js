



//   <!-- for auto play music -->
//   <div id="welcome-screen">
//     <h2>Welcome to My Website</h2>
//     <button onclick="startWebsite()">Enter Site</button>
// </div>

// <audio id="bg-song" loop>
//     <source src="your-song.mp3" type="audio/mpeg">
// </audio>

/*
function startWebsite() {
    // स्क्रीन को छुपाएं
    document.getElementById('welcome-screen').style.display = 'none';
    
    // गाने को प्ले करें
    var audio = document.getElementById('bg-song');
    audio.play().catch(function(error) {
        console.log("Autoplay blocked: ", error);
    });
}
*/












function toggleMusic() {
    var audio = document.getElementById('bg-audio');
    var musicBox = document.getElementById('music-box');
    var statusIcon = document.getElementById('status-icon');
    var statusContainer = document.getElementById('status-icon-container');

    if (audio.paused) {
        // गाना प्ले करें
        audio.play().then(() => {
            // कलर बदलने वाला एनीमेशन चालू करें
            musicBox.classList.remove('bg-light');
            musicBox.classList.add('music-playing');
            musicBox.classList.add('bg-[var(--accent)]');
            musicBox.classList.add('text-light');
            
            // आइकॉन को पॉज़ (pause) में बदलें
            statusIcon.className = 'fas fa-pause text-[8px]';
            
            // स्टेटस बॉक्स का बैकग्राउंड ग्रीन करें (ताकि पता चले एक्टिव है)
            statusContainer.classList.remove('bg-light');
            statusContainer.classList.add('bg-green-500');
            statusContainer.classList.add('border-light');
            statusContainer.classList.add('text-light');
        }).catch(err => {
            console.log("Play blocked or failed: ", err);
        });
    } else {
        // गाना पॉज़ करें
        audio.pause();
        
        // एनीमेशन बंद करें
        musicBox.classList.remove('music-playing');
        musicBox.classList.remove('bg-[var(--accent)]');
        musicBox.classList.remove('text-light');
        musicBox.classList.add('bg-light');
        
        // आइकॉन को वापस प्ले (play) में बदलें
        statusIcon.className = 'fas fa-play text-[6px]';
        
        // स्टेटस बॉक्स का बैकग्राउंड वापस ब्लू करें
        statusContainer.classList.remove('bg-green-500');
        statusContainer.classList.remove('border-light');
        statusContainer.classList.remove('text-light');
        statusContainer.classList.add('bg-light');
    }
}





