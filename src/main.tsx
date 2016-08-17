import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { ByMock } from "../test/FakeAPI";

let api = new ByMock;
ReactDOM.render(
    <App API={api} />,
    document.getElementById('app')
);
api.update({
    modified: [
	{
            name: "Ronmi/react-toy-router",
            branches: [
		{ name: "main", owner: "ronmi", desc: "stable" },
		{ name: "dev", owner: "ronmi", desc: "develop" },
            ],
	},
	{
            name: "Ronmi/react-promise-visualizer",
            branches: [
		{ name: "main", owner: "ronmi", desc: "stable" },
		{ name: "dev", owner: "ronmi", desc: "develop" },
		{ name: "exp", owner: "fraina", desc: "experimental" },
            ],
	},
	{
            name: "Ronmi/some-go-project",
            branches: [
		{ name: "main", owner: "ronmi", desc: "stable" },
		{ name: "dev", owner: "ronmi", desc: "develop" },
            ],
	},
    ],
});
