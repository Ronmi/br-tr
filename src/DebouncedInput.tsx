import * as React from "react";

export interface Props {
    value?: string;
    className?: string;
    placeholder?: string;
    onChange: (val: string) => void;
    debounce: number;
}

export interface State {
    value?: string;
    className?: string;
}

export class DebouncedInput extends React.Component<Props, State> {
    private last_id: number = -1;

    constructor(props?: Props, context?: any) {
        super(props, context);

        this.state = {
            value: this.props.value,
            className: this.props.className
        };
    }

    componentWillReceiveProps(props: Props) {
        this.setState({
            value: props.value,
            className: props.className
        });
    }

    onChange = (e: Event) => {
        let id = ++this.last_id;
        let val = (e.target as HTMLInputElement).value;

        setTimeout(() => { this.validate(id, val) }, this.props.debounce);
        this.setState({ value: val });
    };

    validate(id: number, val: string) {
        if (id !== this.last_id) {
            return;
        }

        this.props.onChange(val);
    }

    render() {
        return <input {...this.state} placeholder={this.props.placeholder} onChange={this.onChange} />;
    }
}
