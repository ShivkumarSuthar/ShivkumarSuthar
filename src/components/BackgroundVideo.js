import { memo } from "react";
import dataList from "./dataList.json"

function BackgroundVideo() {
    return (
        <video className='video-section' autoPlay loop muted>
            <source src={dataList.media.video} type="video/mp4" />
        </video>
    );
}

export default memo(BackgroundVideo);
