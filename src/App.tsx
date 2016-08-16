import * as React from "react";
import Project from "./Project";

export default class App extends React.Component<{}, {}> {
    render() {
        let props = {
            descChanged: (repo: string, desc: string) => {
                return new Promise<void>((s, j) => {
                    setTimeout(s, 3000);
                });
            },
            ownerChanged: (repo: string, owner: string) => {
                return new Promise<void>((s, j) => {
                    setTimeout(s, 3000);
                });
            },
            project: {
                name: "test/repo",
                branches: [
                    { name: "b1", owner: "o1", desc: "d1" },
                    { name: "b2", owner: "", desc: "d2" },
                    { name: "b3", owner: "o3", desc: "" },
                    { name: "b0", owner: "o0", desc: "d0" },
                ],
            },
        };
        return (
            <Project {...props} />
        );
    }
}
