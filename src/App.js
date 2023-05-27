import "./App.css";
import About from "./assests/About";
// import Blog from './assests/Blog';
import Contact from "./assests/Contact";
// import Find from './assests/find';
import Home from "./assests/Home";
import Portfolio from "./assests/Portfolio";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
// import Work from './assests/Work';
// import TextSphere from './assests/TextSphere';
// import Video from './assests/Video';
// import Music from './assests/Music';
import Footer from "./assests/Footer";
import Header from "./assests/Header";
import TimeLine from "./assests/TimeLine";

function App() {
  return (
    <>
      {/* <Home /> */}
      {/* <Header /> */}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />

        <Route exact path="/portfolio" component={Portfolio} />
        <Route exact path="/contact" component={Contact} />
      </Switch>
      <Footer />
      {/* <About /> */}
      {/* <TimeLine /> */}
    </>
  );
}

export default App;
