import heroVideo from "../assets/videos/hero.mp4";
function Video() {
    return (
    <div className="h-screen" >

            <video className=' top-0 left-0 right-0 size z-0 object-cover size-full' autoPlay loop muted >
                <source src={heroVideo} type="video/mp4"/>
            </video>
    </div>


    
    )
}
export default Video