import * as React from "react";
import { Project as proj, Branch as br } from "./types";
import Branch from "./Branch";

export interface Props {
    ownerChanged: (repo: string, owner: string) => Promise<void>;
    descChanged: (repo: string, desc: string) => Promise<void>;
    project: proj;
    keyword?: string;
}

export interface State {
    expanded?: boolean;
}

export default class Project extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
	super(props, context);

	this.state = {
	    expanded: false,
	};
    }

    handleOwnerUpdate: (o: string) => Promise<void> = (o: string) => {
	return this.props.ownerChanged(this.props.project.name, o);
    };
    handleDescUpdate: (o: string) => Promise<void> = (o: string) => {
	return this.props.descChanged(this.props.project.name, o);
    };
    toggleExpand: () => void = () => {
	this.setState({ expanded: !this.state.expanded });
    };

    private renderBranches() {
	const p = this.props.project;
	if (p.branches.length === 0) {
	    return null;
	}
	let brs = p.branches.map(function(br) {
	    return br;
	});

	brs.sort(function(a, b) {
	    if (a.name > b.name) return 1;
	    if (a.name < b.name) return -1;
	    return 0;
	});

	let nodes = brs.map((br) => {
	    const k = this.props.keyword;
	    const chosen = this.props.keyword && (br.name.indexOf(k) >= 0 || br.desc.indexOf(k) >= 0);
	    return <Branch
		       ownerChanged={this.handleOwnerUpdate}
		       descChanged={this.handleDescUpdate}
		       name={br.name}
		       owner={br.owner}
		       desc={br.desc}
		       chosen={chosen}
		       key={br.name} />;
	});
	return (
	    <div className={this.branchesClass}>
		{nodes}
	    </div>
	);
    }

    private get chosen(): boolean {
	if (!this.props.keyword) return false;
	return this.props.project.name.indexOf(this.props.keyword) >= 0;
    }
    private get className(): string {
	let ret = "proj";
	if (this.chosen) ret += " mine";
	return ret;
    }
    private get branchesClass(): string {
	let ret = "branches"
	if (!this.state.expanded) ret += " hidden";
	return ret;
    }
    
    render() {
	return (
	    <div className={this.className}>
		<div className="name" onClick={this.toggleExpand}>{this.props.project.name}</div>
		{this.renderBranches()}
	    </div>
	);
    }
}
