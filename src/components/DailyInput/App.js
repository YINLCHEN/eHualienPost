import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';

import ChipComponent from './ChipComponent';
import AmountComponent from './AmountComponent';
import { connect } from 'react-redux';
import { compose } from "recompose";

import '../../css/App.css';

const styles = theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    nextButton: {
        backgroundColor: '#e3f2fd'
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    }
});

function getSteps() {
    return ['選擇支局', '申報戰況', '確認送出'];
}

function getStepContent(step, classes) {
    switch (step) {
        case 0:
            return <ChipComponent />;
        case 1:
            return <AmountComponent />;
        case 2:
            return;
        default:
            return 'Unknown step';
    }
}

class App extends React.Component {

    state = {
        activeStep: 0,
        postID: null,
        postName: null,
    };

    componentWillReceiveProps(nextProps) {
        if (this.state.activeStep === 0 && nextProps.PostID !== 0) {
            this.setState({
                activeStep: 1
            })
        }

        if (nextProps.PostID !== undefined && nextProps.PostName !== undefined) {
            this.setState({
                postID: nextProps.PostID,
                postName: nextProps.PostName,
            })
        }
    }

    handleNext = () => {
        this.setState({
            activeStep: this.state.activeStep + 1,
        });

        if (this.state.activeStep === 2) {
            console.log('Date: ' + Date())
            console.log('PostID: ' + this.state.postID)
            console.log('PostName: ' + this.state.postName)
            console.log('Amount: ' + this.props.Amount)
            console.log('Count: ' + this.props.Count)
            console.log('Comment: ' + this.props.Comment)
        }
    };

    handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1,
        });
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
            postID: null,
            postName: null,
        });
    };

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        let renderButton;
        let renderStep1 = '' + this.state.postID + '支 ' + this.state.postName;

        if (activeStep !== 0) {
            renderButton =
                <div>
                    <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                    >
                        Back
                    </Button>
                    <Button
                        disabled={!checkNum(this.props.Amount) || !checkNum(this.props.Count)}
                        variant="contained"
                        onClick={this.handleNext}
                        className={classNames(classes.button, classes.nextButton)}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div >;
        }

        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => {
                        const labelProps = {};
                        labelProps.className = "stepper";
                        return (
                            <Step key={label}>
                                <StepLabel {...labelProps}>{label} : <br />
                                    {activeStep !== 0 && index === 0 && this.props.PostID !== 0 ? renderStep1 : null}
                                    {activeStep !== 0 && activeStep !== 1 && index === 1 &&
                                        this.props.Amount !== undefined ?
                                        <RenderStep2
                                            amount={this.props.Amount}
                                            count={this.props.Count}
                                            comment={this.props.Comment}
                                        /> : null}
                                </StepLabel>
                                <StepContent>
                                    <span>{getStepContent(index, classes)}</span>
                                    <div className={classes.actionsContainer}>
                                        {renderButton}
                                    </div>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>本日申報完畢！</Typography>
                        <Button onClick={this.handleReset} className={classes.button}>
                            Reset
                        </Button>
                    </Paper>
                )}
            </div>
        );
    }
}
function RenderStep2(props) {
    return (
        <div>
            金額： {props.amount} 元<br />
            件數： {props.count} 件<br />
            備註： {props.comment}
        </div>
    );
}

function checkNum(value) {
    if (value === undefined || value === null || value === '') {
        return false
    }
    else {
        return true
    }
}

function mapStateToProps(state) {
    return {
        PostID: state.PostID,
        PostName: state.PostName,
        Amount: state.Amount,
        Count: state.Count,
        Comment: state.Comment,
    };
}

App.propTypes = {
    classes: PropTypes.object,
};

export default compose(connect(mapStateToProps), withStyles(styles))(App);
