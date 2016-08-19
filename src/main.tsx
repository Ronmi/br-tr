import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { ByFetch } from "./APIImplement";

ReactDOM.render(
    <App API={new ByFetch(10)} />,
    document.getElementById('app')
);
