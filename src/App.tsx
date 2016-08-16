import * as React from "react";
import { Project as P } from "./types";
import Header from "./Header";
import Project from "./Project";

export interface Props {
}

export interface State {
    projects?: P[];
    keyword?: string;
}

export default class App extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
	    keyword: "",
            projects: [
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
        };
    }
    handleDescUpdate: (r: string, d: string) => Promise<void> = (repo: string, desc: string) => {
        return new Promise<void>((s, j) => {
            setTimeout(s, 3000);
        });
    };
    handleOwnerUpdate: (r: string, o: string) => Promise<void> = (repo: string, owner: string) => {
        return new Promise<void>((s, j) => {
            setTimeout(s, 3000);

        });
    };
    handleKeywordUpdate: (k: string) => void = (k: string) => {
	this.setState({ keyword: k });
    };

    render() {
        let nodes = this.state.projects.map((p) => {
            return (
                <Project
                    ownerChanged={this.handleOwnerUpdate}
                    descChanged={this.handleDescUpdate}
                    project={p}
		    keyword={this.state.keyword}
                    key={p.name} />
            );
        });

        return (
            <div>
		<Header
		    keywordChanged={this.handleKeywordUpdate}
		    name="Patrolavia"
		    img="//www.gravatar.com/avatar/ed050764beb4cc337b2645c519d676fd?s=48" />
                <div className="projects">
                    {nodes}
                </div>
            </div>
        );
    }
}
