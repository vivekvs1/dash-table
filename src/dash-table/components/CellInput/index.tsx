import React, {
    PureComponent
} from 'react';

interface IProps {
    props?: object;
    value?: any;
}

interface IState {
    value: any;
}

export default class CellInput extends PureComponent<IProps, IState> {
    render() {
        const {
            props,
            value
        } = this.props;

        return (<div className='dash-input-cell-value-container dash-cell-value-container'>
            <div className='input-cell-value-shadow cell-value-shadow'>
                {value}
            </div>
            <input
                ref='textInput'
                type='text'
                value={this.state.value}
                {...props}
            />
        </div>);
    }
}