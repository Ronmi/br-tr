import * as React from "react";
import { DebouncedInput } from "./DebouncedInput";

export interface Props {
    keywordChanged: (k: string) => void;
    name: string;
    img: string;
}

export interface State {
}

export default class Header extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
	super(props, context);

	this.state = {
	};
    }

    handleKeywordUpdate: (k: string) => Promise<void> = (k: string) => {
	return new Promise<void>((s, j) => {
	    this.props.keywordChanged(k);
	    s();
	});
    };

    render() {
	return (
	    <div className="header">
		<div className="logo">
		    <span>{this.props.name}</span>
		</div>
		<div className="search">
		    <DebouncedInput debounce={200} onChange={this.handleKeywordUpdate} />
		</div>
		<div className="user">
		    <img src={this.props.img} />
		</div>
	    </div>
	);
    }
}
