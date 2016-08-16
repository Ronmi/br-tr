import * as React from "react";
import Branch from "./Branch";

export default class App extends React.Component<{}, {}> {
    render() {
	let props = {
	    descChanged: (desc: string) => {
		return new Promise<void>((s,j) => {
		    setTimeout(s, 3000);
		});
	    },
	    ownerChanged: (owner: string) => {
		return new Promise<void>((s,j) => {
		    setTimeout(s, 3000);
		});
	    },
	    name: "branch_name",
	    owner: "test_owner",
	    desc: "test description",
	};
	return (
	    <Branch {...props} />
	);
    }
}
