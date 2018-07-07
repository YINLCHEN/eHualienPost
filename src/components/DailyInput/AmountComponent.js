/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';
import { compose } from "recompose";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};
function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

CountFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};
function CountFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
        />
    );
}

class AmountComponent extends React.Component {
    state = {
        numberformat: '',
        countformat: '',
        comment: '',
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    componentDidUpdate() {
        this.props.dispatch({
            type: 'ADD_Performance',
            amount: this.state.numberformat,
            count: this.state.countformat,
            comment: this.state.comment,
        });
    };

    render() {
        const { classes } = this.props;
        const { numberformat } = this.state;
        const { countformat } = this.state;

        return (
            <div className={classes.container}>
                <TextField
                    fullWidth
                    id="formatted-numberformat-input"
                    label="金額"
                    className={classes.formControl}
                    type="tel"
                    value={numberformat}
                    onChange={this.handleChange('numberformat')}
                    InputProps={{
                        inputComponent: NumberFormatCustom,
                    }}
                />
                <TextField
                    fullWidth
                    id="formatted-countformat-input"
                    label="件數"
                    className={classes.formControl}
                    type="tel"
                    value={countformat}
                    onChange={this.handleChange('countformat')}
                    InputProps={{
                        inputComponent: CountFormatCustom,
                    }}
                />
                <TextField
                    fullWidth multiline
                    id="comment"
                    label="備註"
                    className={classes.formControl}
                    value={this.state.comment}
                    onChange={this.handleChange('comment')}
                    rowsMax="10"
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

AmountComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(connect(mapStateToProps), withStyles(styles, { withTheme: true }))(AmountComponent);
