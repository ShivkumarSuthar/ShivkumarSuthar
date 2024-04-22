import heroVideo from "../assets/videos/hero.mp4";

function Video() {
    return (
        <div className="h-screen relative">

            <video className='absolute top-0 left-0 w-full h-full object-cover z-0' autoPlay loop muted>
                <source src={heroVideo} type="video/mp4"/>
            </video>
            
        </div>
    );
}

export default Video;
