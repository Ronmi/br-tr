import * as React from "react";
import { DebouncedInput } from "./DebouncedInput";
import { User } from "./API";

export interface Props {
    keywordChanged: (k: string) => void;
    name: string;
    user: User;
    loginURL: string;
}

export interface State {
    keyword?: string;
}

export default class Header extends React.Component<Props, State> {
    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            keyword: "",
        };
    }

    handleKeywordUpdate: (k: string) => Promise<void> = (k: string) => {
        return new Promise<void>((s, j) => {
            this.setState({ keyword: k });
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
                    <DebouncedInput placeholder="Search" value={this.state.keyword} debounce={200} onChange={this.handleKeywordUpdate} />
                </div>
                <div className="user">
		    <a href={this.props.loginURL}><img src={this.props.user.avatar} title={this.props.user.name} /></a>
                </div>
            </div>
        );
    }
}
