import * as React from "react";
import { Project as P } from "./types";
import Header from "./Header";
import Project from "./Project";
import { API, ChangeSet } from "./API";

export interface Props {
    API: API;
}

export interface State {
    projects?: { [name: string]: P };
    keyword?: string;
}

type Ps = { [name: string]: P };

function dupe(ps: Ps): Ps {
    let ret: Ps = {}
    for (let n in ps) {
	ret[n] = ps[n];
    }
    return ret;
}

export default class App extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            keyword: "",
            projects: {},
        };

	this.props.API.onUpdate(this.mergeChangeset);
    }
    private mergeChangeset: (c: ChangeSet) => void = (c: ChangeSet) => {
	let dest = dupe(this.state.projects);
	
	// remove deleted projects
	if (c.deleted && c.deleted.length) {
	    for (let i = 0; i < c.deleted.length; i++) {
		const n: string = c.deleted[i];
		delete dest[n];
	    }
	}

	// update modified projects, including inserting it
	if (c.modified && c.modified.length) {
	    for (let i = 0; i < c.modified.length; i++) {
		const p: P = c.modified[i];
		dest[p.name] = p;
	    }
	}

	this.setState({ projects: dest });
    };
    handleDescUpdate: (r: string, b: string, d: string) => Promise<void> = (repo: string, br: string, desc: string) => {
        return new Promise<void>((s, j) => {
            setTimeout(() => {
		let dest = dupe(this.state.projects);
		if (!dest[repo]) {
		    j();
		    return;
		}

		let found = false;
		for (let i = 0; i < dest[repo].branches.length; i++) {
		    const b = dest[repo].branches[i];
		    if (b.name == br) {
			dest[repo].branches[i].desc = desc;
			found = true;
			break;
		    }
		}
		if (!found) {
		    j();
		    return;
		}
		this.setState({ projects: dest });
		s();
	    }, 3000);
        });
    };
    handleOwnerUpdate: (r: string, b: string, o: string) => Promise<void> = (repo: string, br: string, owner: string) => {
        return new Promise<void>((s, j) => {
            setTimeout(() => {
		let dest = dupe(this.state.projects);
		if (!dest[repo]) {
		    j();
		    return;
		}

		let found = false;
		for (let i = 0; i < dest[repo].branches.length; i++) {
		    const b = dest[repo].branches[i];
		    if (b.name == br) {
			dest[repo].branches[i].owner = owner;
			found = true;
			break;
		    }
		}
		if (!found) {
		    j();
		    return;
		}
		this.setState({ projects: dest });
		s();
	    }, 3000);

        });
    };
    handleKeywordUpdate: (k: string) => void = (k: string) => {
        this.setState({ keyword: k });
    };

    render() {
        let nodes: JSX.Element[] = [];
	for (let n in this.state.projects) {
	    const p = this.state.projects[n];
            nodes.push(
                <Project
                    ownerChanged={this.handleOwnerUpdate}
                    descChanged={this.handleDescUpdate}
                    project={p}
                    keyword={this.state.keyword}
                    key={p.name} />
            );
	}

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
