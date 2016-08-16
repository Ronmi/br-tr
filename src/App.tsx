import * as React from "react";
import Branches from "./Branches";

export default class App extends React.Component<{}, {}> {
    render() {
	let props = {
	    descChanged: (repo: string, desc: string) => {
		return new Promise<void>((s,j) => {
		    setTimeout(s, 3000);
		});
	    },
	    ownerChanged: (repo: string, owner: string) => {
		return new Promise<void>((s,j) => {
		    setTimeout(s, 3000);
		});
	    },
	    name: "test/repo",
	    branches: [
		{name: "b1", owner: "o1", desc: "d1"},
		{name: "b2", owner: "o2", desc: ""},
		{name: "b3", owner: "", desc: "d3"},
		{name: "b0", owner: "o0", desc: "d0"},
	    ],
	};
	return (
	    <Branches {...props} />
	);
    }
}
