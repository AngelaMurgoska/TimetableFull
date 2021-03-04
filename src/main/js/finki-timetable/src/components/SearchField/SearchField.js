import React, { Component, Fragment } from 'react';
import Select from 'react-select';


type State = {
    isClearable: boolean,
    isDisabled: boolean,
    isLoading: boolean,
    isRtl: boolean,
    isSearchable: boolean,
};

export default class SingleSelect extends Component<*, State> {
    state = {
        isClearable: this.props.isClearable,
        isDisabled: false,
        isLoading: false,
        isRtl: false,
        isSearchable: true,
    };

    render() {
        const {
            isClearable,
            isSearchable,
            isDisabled,
            isLoading,
            isRtl,
        } = this.state;
        return (
            <Fragment>
                <Select
                onChange = {this.props.onChangeMethod}
                className="basic-single"
                classNamePrefix = "select"
                isDisabled={isDisabled}
                isLoading={isLoading}
                isClearable={isClearable}
                isRtl={isRtl}
                isSearchable={isSearchable}
                name="color"
                placeholder = {this.props.searchPlaceholder}
                options = {this.props.searchData}
                defaultValue = {this.props.defaultValue}
                />
            </Fragment>
        )
    }
}