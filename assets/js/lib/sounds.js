const muteBtn = document.getElementById("mute")

let Sounds = {
    
    track: new Audio(),
    audioAllowed: true

}

Sounds.track.src = '/public/audio/message.wav'

Sounds.playNotification = () => { if (Sounds.audioAllowed) { Sounds.track.play() } }

Sounds.toggleNotificationSounds = (event) => {
    
    const button = event.target

    if (Sounds.audioAllowed){
        Sounds.audioAllowed = false
        button.innerHTML = "Unmute Sound"
    } else {
        Sounds.audioAllowed = true
        button.innerHTML = "Mute Sound"
    }
} 

muteBtn.addEventListener("click", (event) => Sounds.toggleNotificationSounds(event), false)

export {Sounds}


