import React, { useEffect, useState } from 'react'
import Sound from 'use-sound';
import audio from './icons/BACKGROUND MUSIC.mp3'

function Music(handleSongPlaying, handleSongLoading, handleFinishPlaying) {

    const [isPlaying, setisPlaying] = useState(false);




    return (
        <div>

            {/* <audio id='myAudio'>
                <source src={sound}></source>
            </audio>
            <button onClick={start} type='button'>play</button> */}
            <button onClick={() => setisPlaying(!isPlaying)} type='button'>{!isPlaying ? 'play' : 'stop'}</button>
            <Sound
                url={audio}
                // playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
                onLoading={handleSongLoading}
                onPlaying={handleSongPlaying}
                onFinishPlaying={handleFinishPlaying}
            />
        </div>
    )
}

export default Music