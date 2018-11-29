import React, {
    ChangeEvent,
    ClipboardEvent,
    KeyboardEvent,
    MouseEvent,
    PureComponent
} from 'react';
import CellLabel from '../CellLabel';
import { KEY_CODES, isNavKey } from 'dash-table/utils/unicode';

interface IProps {
    active: boolean;
    className?: string;
    focused: boolean;
    onChange: (e: ChangeEvent) => void;
    onClick: (e: MouseEvent) => void;
    onDoubleClick: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onPaste: (e: ClipboardEvent<Element>) => void;
    readonly: boolean;
    value?: any;
}

interface IState {
    value: any;
}

export default class CellInput extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    componentWillReceiveProps(nextProps: IProps) {
        const { value: nextValue } = nextProps;

        if (this.state.value !== nextValue) {
            this.setState({
                value: nextValue
            });
        }
    }

    render() {
        const {
            active,
            className,
            onClick,
            onDoubleClick,
            readonly,
            value
        } = this.props;

        const displayLabel = (!active && this.state.value === this.props.value) || !readonly;

        return displayLabel ?
            (<CellLabel
                className={className}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                value={value}
            />) :
            (<div className='dash-input-cell-value-container dash-cell-value-container'>
                <div className='input-cell-value-shadow cell-value-shadow'>
                    {value}
                </div>
                <input
                    ref='input'
                    type='text'
                    className={className}
                    onBlur={this.propagateChange}
                    onChange={this.handleChange}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                    onKeyDown={this.handleKeyDown}
                    value={this.state.value}
                />
            </div>);
    }

    private propagateChange = () => {
        if (this.state.value === this.props.value) {
            return;
        }

        const { onChange } = this.props;

        onChange(this.state.value);
    }

    private handleChange = (e: any) => {
        this.setState({ value: e.target.value });
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        const is_focused = this.props.focused;

        if (is_focused &&
            (e.keyCode !== KEY_CODES.TAB && e.keyCode !== KEY_CODES.ENTER)
        ) {
            return;
        }

        if (!is_focused && !isNavKey(e.keyCode)) {
            return;
        }

        this.propagateChange();
    }
}