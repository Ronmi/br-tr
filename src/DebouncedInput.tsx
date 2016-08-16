import * as React from "react";

export interface Props {
    value?: string;
    onChange: (val: string) => void;
    debounce: number;
}

export interface State {
    val?: string;
}

export class DebouncedInput extends React.Component<Props, State> {
    private last_id: number = -1;

    constructor(props?: Props, context?: any) {
	super(props, context);

	this.state = { val: this.props.value };
    }

    componentWillReceiveProps(props: Props) {
	this.setState({ val: this.props.value });
    }

    onChange = (e: Event) => {
	let id = ++this.last_id;
	let val = (e.target as HTMLInputElement).value;

	setTimeout(() => { this.validate(id, val) }, this.props.debounce);
	this.setState({ val: val });
    };

    validate(id: number, val: string) {
	if (id !== this.last_id) {
	    return;
	}

	this.props.onChange(val);
    }

    render() {
	return <input onChange={this.onChange} value={this.state.val} />;
    }
}
