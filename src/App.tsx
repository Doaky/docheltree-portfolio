import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage/home';
import ProjectsPage from './pages/ProjectsPage/projects';
// import { useEffect } from 'react';

function App () {

  // useEffect(() => {
  //   if (window && document) {
  //     const script = document.createElement('script');
  //     const body = document.getElementsByTagName('body')[0];
  //     script.src = 'src\\grained.min.js';
  //     body.appendChild(script);
  //     // script.addEventListener('load', () => {
  //     //   window.hbspt.forms.create({
  //     //     // this example embeds a Hubspot form into a React app but you can tweak it for your use case
  //     //     // any code inside this 'load' listener will run after the script is appended to the page and loaded in the client
  //     //   })
  //     // })
  //   }
  // });

  return (
    <BrowserRouter>
      {/*
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.tsx</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div> */}
      {/* <div>
        <Link to='/'>Home</Link>
      </div> */}
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/projects" Component={ProjectsPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
