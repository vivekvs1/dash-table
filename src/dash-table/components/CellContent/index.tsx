import * as R from 'ramda';
import React, {
    PureComponent
} from 'react';

import DOM from 'core/browser/DOM';

import {
    ICellDefaultProps,
    ICellProps,
    ICellPropsWithDefaults
} from 'dash-table/components/CellContent/props';

import { ColumnType } from 'dash-table/components/Table/props';
import dropdownHelper from 'dash-table/components/dropdownHelper';
import CellLabel from '../CellLabel';
import CellInput from '../CellInput';
import CellDropdown from '../CellDropdown';

export default class CellContent extends PureComponent<ICellProps> {

    public static defaultProps: ICellDefaultProps = {
        conditionalDropdowns: [],
        type: ColumnType.Text
    };

    constructor(props: ICellProps) {
        super(props);
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
                className={classes.join(' ')}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
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
            onChange,
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

        return (<CellInput
            ref='input'
            active={active}
            className={classes.join(' ')}
            focused={focused}
            onChange={onChange}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseUp={onMouseUp}
            onPaste={onPaste}
            readonly={editable}
            value={value}
        />);
    }

    private renderValue() {
        const { value } = this.propsWithDefaults;

        return (<CellLabel
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

    handleOpenDropdown = () => {
        dropdownHelper(
            this.dropdown.wrapper.querySelector('.Select-menu-outer'),
            this.td
        );
    }

    get dropdown(): any {
        return this.refs.dropdown &&
            (this.refs.dropdown as any).refs &&
            (this.refs.dropdown as any).refs.dropdown;
    }

    get input(): any {
        return this.refs.input &&
            (this.refs.input as any).refs &&
            (this.refs.input as any).refs.input;
    }

    get td(): any {
        return this.refs.td;
    }

    componentDidUpdate() {
        const { active } = this.propsWithDefaults;
        if (!active) {
            return;
        }

        const dropdown = this.dropdown;
        const input = this.input;

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