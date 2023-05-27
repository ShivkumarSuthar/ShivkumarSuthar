import React from 'react';
import video from './images/science-fiction-6420.mp4';

function Video() {
    return (
        <video className='videoTag' autoPlay loop muted>
            <source src={video} type='video/mp4' />
        </video>

    )
}

export default Video