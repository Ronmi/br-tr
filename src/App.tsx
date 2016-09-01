import * as React from "react";
import { Project as P } from "./types";
import Header from "./Header";
import Project from "./Project";
import { API, ChangeSet, User, Guest } from "./API";

export interface Props {
    API: API;
}

export interface State {
    projects?: { [name: string]: P };
    keyword?: string;
    me?: User;
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
    private loginURL: string;

    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            keyword: "",
            projects: {},
            me: Guest,
        };

        this.props.API.onUpdate(this.mergeChangeset);
        this.loginURL = "/";
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
            this.props.API.updateDesc(repo, br, desc).then(s, j);
        });
    };
    handleOwnerUpdate: (r: string, b: string, o: string) => Promise<void> = (repo: string, br: string, owner: string) => {
        return new Promise<void>((s, j) => {
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

            this.props.API.updateOwner(repo, br, owner).then(s, j);
        });
    };
    handleKeywordUpdate: (k: string) => void = (k: string) => {
        this.setState({ keyword: k });
    };
    handleBranchCreate: (r: string, b: string, d: string) => Promise<void> = (repo: string, br: string, desc: string) => {
        return this.props.API.addBranch(repo, br, desc);
    };

    async setup() {
        try {
            this.loginURL = await this.props.API.authURL();
        } catch (e) { }

        let me: User = Guest;
        try {
            me = await this.props.API.me();
        } catch (e) { }

        this.setState({
            me: me,
        });
    }
    componentWillMount() {
        this.setup();
    }
    render() {
        let nodes: JSX.Element[] = [];
        for (let n in this.state.projects) {
            const p = this.state.projects[n];
            nodes.push(
                <Project
                    ownerChanged={this.handleOwnerUpdate}
                    descChanged={this.handleDescUpdate}
                    branchCreated={this.handleBranchCreate}
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
                    user={this.state.me}
                    loginURL={this.loginURL} />
                <div className="projects">
                    {nodes}
                </div>
            </div>
        );
    }
}
