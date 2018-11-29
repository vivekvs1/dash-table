import React, {
    PureComponent
} from 'react';
import Dropdown from 'react-select';

import { IDropdownOptions } from '../CellContent/types';

interface IProps {
    dropdown: IDropdownOptions;
    props?: object;
    value?: any;
}

export default class CellDropdown extends PureComponent<IProps> {
    render() {
        const {
            dropdown,
            props,
            value
        } = this.props;

        return (<div className='dash-dropdown-cell-value-container dash-cell-value-container'>
            <div className='dropdown-cell-value-shadow cell-value-shadow'>
                {(dropdown.find(entry => entry.value === value) || { label: undefined }).label}
            </div>
            <Dropdown
                {...props}
                options={dropdown}
                value={value}
            />
        </div>);
    }
}