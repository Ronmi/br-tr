import * as React from "react";

export interface Props {
    value?: string;
    onChange: (val: string) => void;
    debounce: number;
}

export class DebouncedInput extends React.Component<Props, {}> {
    private last_id: number = -1;

    onChange = (e: Event) => {
	let id = ++this.last_id;
	let val = (e.target as HTMLInputElement).value;

	setTimeout(() => { this.validate(id, val) }, this.props.debounce);
    };

    validate(id: number, val: string) {
	if (id !== this.last_id) {
	    return;
	}

	this.props.onChange(val);
    }

    render() {
	return <input onChange={this.onChange} value={this.props.value} />;
    }
}
