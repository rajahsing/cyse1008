
import './global.css';
import { useScrollToTop } from './hooks/use-scroll-to-top';

import Router from './routes/sections';
import ThemeProvider from './theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
<<<<<<< HEAD
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React with Cliff Coulter
        </a>
      </header>
    </div>
    <RouterProvider router={router} />
=======
    <ThemeProvider>
      <Router />
    </ThemeProvider>
>>>>>>> feature/assignment3
  );
}

// import React from 'react';
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
// import ProtectedRoute from './components/ProtectedRoute';
// import SignInPage from './components/SignInPage';
// import HomePage from './components/HomePage';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <ProtectedRoute><HomePage/></ProtectedRoute>,
//   },
//   {
//     path: "/signin",
//     element: <SignInPage />
//   }
// ]);

// function App() {
//   return (
//     <RouterProvider router={router} />
//   );
// }

// export default App;