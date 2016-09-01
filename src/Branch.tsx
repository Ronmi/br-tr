import * as React from "react";
import { Visualizer, DefaultProvider as provider } from "react-promise-visualizer";
import { Branch as br } from "./types";
import { DebouncedInput } from "./DebouncedInput";

export interface Props extends br {
    ownerChanged: (br: string, owner: string) => Promise<void>;
    descChanged: (br: string, desc: string) => Promise<void>;
    chosen?: boolean;
}

export interface State {
    owner?: string;
    desc?: string;
}

export default class Branch extends React.Component<Props, State> {
    private v_owner: Visualizer;
    private v_desc: Visualizer;

    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            owner: this.props.owner,
            desc: this.props.desc,
        };
    }

    private get className(): string {
        let ret = "branch";
        if (this.props.chosen) ret += " mine";
        return ret;
    }

    handleOwnerUpdate = async (owner: string) => {
        let old = this.state.owner;
        this.setState({ owner: owner });

        try {
            await this.v_owner.show(this.props.ownerChanged(this.props.name, owner));
        } catch (e) {
            this.setState({ owner: old });
        }
    };
    handleDescUpdate = async (desc: string) => {
        let old = this.state.desc;
        this.setState({ desc: desc });

        try {
            await this.v_desc.show(this.props.descChanged(this.props.name, desc));
        } catch (e) {
            this.setState({ desc: old });
        }
    };

    render() {
        return (
            <div className={this.className}>
                <span className="name">{this.props.name}</span>
                <DebouncedInput
		    className="owner"
		    value={this.state.owner}
		    placeholder="username"
		    onChange={this.handleOwnerUpdate}
		    debounce={500} />
                <div className="state">
                    <Visualizer className="state" provider={new provider} ref={c => this.v_owner = c} />
                </div>
                <DebouncedInput
		    className="desc"
		    value={this.state.desc}
		    placeholder="description"
		    onChange={this.handleDescUpdate}
		    debounce={500} />
                <div className="state">
                    <Visualizer className="state" provider={new provider} ref={c => this.v_desc = c} />
                </div>
            </div>
        );
    }
}
