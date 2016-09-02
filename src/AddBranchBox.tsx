import * as React from "react";
import { Project as proj, Branch as br } from "./types";
import { Visualizer, DefaultProvider as provider } from "react-promise-visualizer";
import Branch from "./Branch";

export interface Props {
    branchCreated: (br: string, ref: string, desc: string) => Promise<void>;
}

export interface State {
    show?: boolean; // asking for branch name?
}

export default class AddBranchBox extends React.Component<Props, State> {
    private branchInput: HTMLInputElement;
    private refInput: HTMLInputElement;
    private descInput: HTMLInputElement;
    private v_branch: Visualizer;
    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            show: false,
        };

    }

    setShow(show: boolean) {
	this.setState({ show: show });
    }
    toggle: () => void = () => {
	this.setShow(!this.state.show);
    };
    close: () => void = () => {
	this.setShow(false);
    };
    noPropagate: (e: Event) => void = (e: Event) => {
        e.stopPropagation();
    };
    handleCreate: (e: Event) => void = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
	const br = this.branchInput.value;
	const ref = this.refInput.value;
	const desc = this.descInput.value;
        this.v_branch.show(this.props.branchCreated(br, ref, desc)).then(() => {
	    this.setShow(false);
        }, function(){});
    };

    componentDidMount() {
	if (window) {
	    window.addEventListener("click", this.close, false)
	}
    }
    componentWillUnmount() {
	if (window) {
	    window.removeEventListener("click", this.close, false)
	}
    }
    shouldComponentUpdate(p: Props, s: State) {
	return s.show != this.state.show;
    }
    componentDidUpdate() {
	if (this.state.show && this.branchInput) {
	    this.branchInput.focus();
	}
    }
    render() {
	let cls = "prompt";
	if (!this.state.show) {
	    cls += " hidden";
	}
        return (
            <div className="plus" onClick={this.noPropagate}>
                <img style={{ height: 'inherit' }} src="img/plus.svg" onClick={this.toggle} />
		<form className={cls} onSubmit={this.handleCreate}>
                    <input type="text" placeholder="new_branch" ref={c => this.branchInput = c} />
                    <input type="text" defaultValue="master" placeholder="from_branch" ref={c => this.refInput = c} />
                    <input type="text" placeholder="description" ref={c => this.descInput = c} />
                    <button type="submit">Create</button>
                    <Visualizer className="state" provider={new provider} ref={c => this.v_branch = c} />
		</form>
            </div>
        );
    }
}
