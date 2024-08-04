import React, { useEffect, useState } from "react";
import screenfull from "screenfull";
import LeftLayout from "./LeftLayout";
import CenterLayout from "./CenterLayout";
import RightLayout from "./RightLayout";
import Loading from "./Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  const requestFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request().then(() => {
        setFullScreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  if (isLoading) {
    // return <Loading />;
  }

  return (
    <div className="app">
      {/* {!fullScreen && <button onClick={requestFullscreen}>Go Fullscreen</button>} */}
      {/* {fullScreen && ( */}
        <>
          <LeftLayout />
          <CenterLayout />
          <RightLayout />
        </>
      {/* )} */}
    </div>
  );
}

export default App;
