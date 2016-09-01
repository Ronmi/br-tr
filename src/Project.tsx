import * as React from "react";
import { Project as proj, Branch as br } from "./types";
import AddBranchBox from "./AddBranchBox";
import Branch from "./Branch";

export interface Props {
    ownerChanged: (repo: string, br: string, owner: string) => Promise<void>;
    descChanged: (repo: string, br: string, desc: string) => Promise<void>;
    branchCreated: (repo: string, br: string, ref: string, desc: string) => Promise<void>;
    project: proj;
    keyword?: string;
}

export interface State {
    expanded?: boolean;
}

export default class Project extends React.Component<Props, State> {
    private box: AddBranchBox;
    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            expanded: false,
        };

        this.setupNodes(this.props);
        this.state.expanded = this.shouldExpand(this.props);
    }
    private nodes: JSX.Element[] = [];

    componentWillReceiveProps(props: Props) {
        this.setupNodes(props);
        this.setState({ expanded: this.shouldExpand(props) });
    }

    private setupNodes(props: Props) {
        const p = props.project;
        const kw = props.keyword;
        if (p.branches.length === 0) {
            this.nodes = [];
            return;
        }
        let brs = p.branches.map(function(br) {
            return br;
        });

        brs.sort(function(a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        });

        this.nodes = brs.map((br) => {
            const chosen = kw != "" && (br.name.indexOf(kw) >= 0 || br.desc.indexOf(kw) >= 0);
            return <Branch
                ownerChanged={this.handleOwnerUpdate}
                descChanged={this.handleDescUpdate}
                name={br.name}
                owner={br.owner}
                desc={br.desc}
                chosen={chosen}
                key={br.name} />;
        });
    }

    handleOwnerUpdate: (b: string, o: string) => Promise<void> = (b: string, o: string) => {
        return this.props.ownerChanged(this.props.project.name, b, o);
    };
    handleDescUpdate: (b: string, o: string) => Promise<void> = (b: string, o: string) => {
        return this.props.descChanged(this.props.project.name, b, o);
    };
    toggleExpand: (e: any) => void = (e: any) => {
        this.setState({ expanded: !this.state.expanded });
    };
    noPropagate: (e: Event) => void = (e: Event) => {
        e.stopPropagation();
    };
    togglePrompt: (e: Event) => void = (e: Event) => {
        e.stopPropagation();
	this.box.toggle();
    };
    handleCreate: (b: string, r: string, d: string) => Promise<void> = (br: string, ref: string, desc: string) => {
	const name = this.props.project.name;
        return this.props.branchCreated(name, br, ref, desc);
    };

    private renderBranches() {
        if (this.nodes.length < 1) return null;
        return (
            <div className={this.branchesClass}>
                {this.nodes}
            </div>
        );
    }

    expand() {
        this.setState({ expanded: true });
    }
    collapse() {
        this.setState({ expanded: false });
    }

    private shouldExpand(props: Props): boolean {
        if (props.keyword) {
            return this.nodes.reduce((b, n) => {
                return b || n.props.chosen;
            }, false);
        }
        return this.state.expanded;
    }
    private get chosen(): boolean {
        if (!this.props.keyword) return false;
        return this.props.project.name.indexOf(this.props.keyword) >= 0;
    }
    private rootClass(nodes: JSX.Element[]): string {
        let ret = "proj";
        let show = true;
        if (this.props.keyword && !this.chosen) {
            show = false;
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].props.chosen) {
                    show = true;
                    break;
                }
            }
        }
        if (!show) ret += " hidden";
        return ret;
    }
    private get titleClass(): string {
        let ret = "title";
        if (this.chosen) ret += " mine";
        return ret;
    }
    private get branchesClass(): string {
        let ret = "branches";
        if (!this.state.expanded) ret += " hidden";
        return ret;
    }

    render() {
        let nodes = this.renderBranches();
        return (
            <div className={this.rootClass(this.nodes)}>
                <div className={this.titleClass} onClick={this.toggleExpand}>
                    <span className="name">{this.props.project.name}</span>
                    <div className="plus" onClick={this.noPropagate}>
                        <img style={{ height: 'inherit' }} src="img/plus.svg" onClick={this.togglePrompt} />
			<AddBranchBox branchCreated={this.handleCreate} ref={c => this.box = c} />
                    </div>
                </div>
                {nodes}
            </div>
        );
    }
}
