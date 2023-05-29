import "./App.css";
import About from "./assests/About";
import Contact from "./assests/Contact";
import Home from "./assests/Home";
import Portfolio from "./assests/Portfolio";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Footer from "./assests/Footer";


function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />

        <Route exact path="/portfolio" component={Portfolio} />
        <Route exact path="/contact" component={Contact} />
      </Switch>
      <Footer />
    </>
  );
}

export default App;
