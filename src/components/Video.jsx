import heroVideo from "../assets/videos/hero.mp4";
function Video() {
    return (
    <div className=" w-screen h-screen bg-[#151515] flex justify-center items-center " >

            <video className=' w-screen h-svh absolute top-0 aspect-square bg-cover z-0' autoPlay loop muted >
                <source src={heroVideo} type="video/mp4"/>
            </video>
    </div>


    
    )
}
export default Video