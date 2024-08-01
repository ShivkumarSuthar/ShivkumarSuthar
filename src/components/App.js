import React, { useEffect, useState } from "react";
import LeftLayout from "./LeftLayout"
import CenterLayout from "./CenterLayout"
import RightLayout from "./RightLayout"
import Loading from "./Loading";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  // if (isLoading) {
  //   return <Loading />;
  //   return <Loading />;
  // }
    return <Loading />;

  return (
    <div className="app">
      <LeftLayout/>
      <CenterLayout/>
      <RightLayout/>
    </div>
  );
}

export default App;
