import React, { Component, Fragment } from "react";

import GlobalStyle from "./styles/global";

import Main from "./pages/Main";

const App = () => (
  <Fragment>
    <GlobalStyle />
    <div className="App">
      <Main />
    </div>
  </Fragment>
);

export default App;
