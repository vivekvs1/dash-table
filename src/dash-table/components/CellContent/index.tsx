import * as R from 'ramda';
import React, {
    PureComponent,
    KeyboardEvent
} from 'react';

import DOM from 'core/browser/DOM';
import { KEY_CODES, isNavKey } from 'dash-table/utils/unicode';

import {
    ICellDefaultProps,
    ICellProps,
    ICellPropsWithDefaults,
    ICellState
} from 'dash-table/components/CellContent/props';

import { ColumnType } from 'dash-table/components/Table/props';
import dropdownHelper from 'dash-table/components/dropdownHelper';
import CellLabel from '../CellLabel';
import CellInput from '../CellInput';
import CellDropdown from '../CellDropdown';

export default class CellContent extends PureComponent<ICellProps, ICellState> {

    public static defaultProps: ICellDefaultProps = {
        conditionalDropdowns: [],
        type: ColumnType.Text
    };

    constructor(props: ICellProps) {
        super(props);

        this.state = {
            value: props.value
        };
    }

    private get propsWithDefaults(): ICellPropsWithDefaults {
        return this.props as ICellPropsWithDefaults;
    }

    private renderDropdown() {
        const {
            active,
            clearable,
            dropdown,
            editable,
            focused,
            onChange,
            onClick,
            onDoubleClick,
            value
        } = this.propsWithDefaults;

        const classes = [
            ...(active ? ['input-active'] : []),
            ...(focused ? ['focused'] : ['unfocused']),
            ...['dash-cell-value']
        ];

        const attributes = {
            className: classes.join(' '),
            onClick: onClick,
            onDoubleClick: onDoubleClick
        };

        return !dropdown || !editable ?
            (<CellLabel
                props={attributes}
                value={value}
            />) :
            (<CellDropdown
                ref='dropdown'
                dropdown={dropdown}
                props={R.merge({
                    clearable,
                    onChange: (newValue: any) => {
                        onChange(newValue ? newValue.value : newValue);
                    },
                    onOpen: this.handleOpenDropdown,
                    placeholder: ''
                }, attributes)}
                value={value}
            />);
    }

    private renderInput() {
        const {
            active,
            editable,
            focused,
            onClick,
            onDoubleClick,
            onMouseUp,
            onPaste,
            value
        } = this.propsWithDefaults;

        const classes = [
            ...(active ? ['input-active'] : []),
            ...(focused ? ['focused'] : ['unfocused']),
            ...['dash-cell-value']
        ];

        const readonly = (!active && this.state.value === this.props.value) || !editable;

        const attributes = {
            className: classes.join(' '),
            onClick: onClick,
            onDoubleClick: onDoubleClick
        };

        return readonly ?
            (<CellLabel
                props={attributes}
                value={value}
            />) :
            (<CellInput
                ref='input'
                props={R.merge({
                    onBlur: this.propagateChange,
                    onChange: this.handleChange,
                    onKeyDown: this.handleKeyDown,
                    onMouseUp,
                    onPaste
                }, attributes)}
                value={this.state.value}
            />);
    }

    private renderValue(props = {}, value?: string) {
        value = value || this.propsWithDefaults.value;

        return (<CellLabel
            props={props}
            value={value}
        />);
    }

    render() {
        const { type } = this.props;

        switch (type) {
            case ColumnType.Text:
            case ColumnType.Numeric:
                return this.renderInput();
            case ColumnType.Dropdown:
                return this.renderDropdown();
            default:
                return this.renderValue();
        }
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

    handleOpenDropdown = () => {
        const { dropdown, td }: { [key: string]: any } = this.refs;

        dropdownHelper(
            dropdown.wrapper.querySelector('.Select-menu-outer'),
            td
        );
    }

    componentWillReceiveProps(nextProps: ICellPropsWithDefaults) {
        const { value: nextValue } = nextProps;

        if (this.state.value !== nextValue) {
            this.setState({
                value: nextValue
            });
        }
    }

    componentDidUpdate() {
        const { active } = this.propsWithDefaults;
        if (!active) {
            return;
        }

        const input = this.refs.textInput as HTMLInputElement;
        const dropdown = this.refs.dropdown as any;

        if (input && document.activeElement !== input) {
            input.focus();
            input.setSelectionRange(0, input.value ? input.value.length : 0);
        }

        if (dropdown && document.activeElement !== dropdown) {
            // Limitation. If React >= 16 --> Use React.createRef instead to pass parent ref to child
            const tdParent = DOM.getFirstParentOfType(dropdown.wrapper, 'td');
            if (tdParent) {
                tdParent.focus();
            }
        }
    }
}