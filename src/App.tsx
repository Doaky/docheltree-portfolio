import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage/home';
// import ProjectsPage from './pages/ProjectsPage/projects';

function App () {
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
        {/* <Route path="/projects" Component={ProjectsPage} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
