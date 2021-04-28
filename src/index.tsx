import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { BrowserRouter as Router } from "react-router-dom";
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
