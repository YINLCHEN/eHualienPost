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
import LinearProgress from '@material-ui/core/LinearProgress';

import classNames from 'classnames';
import axios from 'axios';
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
            return <ChipComponent mode="dailyinput" />;
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
        done: false,
        todayDateTime: null,
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
            var dateTime = new Date();
            dateTime.setHours(dateTime.getHours());
            const todayDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');

            axios.get('/api/v1/insertDailyInput/', {
                params: {
                    post_id: this.state.postID,
                    case_amount: this.props.Amount,
                    case_count: this.props.Count,
                    case_comment: this.props.Comment,
                    created_date: todayDateTime
                }
            })
                .then(res => {
                    this.setState({
                        done: true,
                        todayDateTime: todayDateTime
                    })
                })
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
            done: false,
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
                                            done={this.state.done}
                                        /> : null}
                                    {activeStep === 3 && index === 2 ? <RenderStep3 done={this.state.done} todayDateTime={this.state.todayDateTime} /> : null}
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
                {activeStep === steps.length && !this.state.done && (
                    <LinearProgress color="secondary" />
                )}
                {activeStep === steps.length && this.state.done && (
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
            金額： {props.amount} 元 <br />
            件數： {props.count} 件 <br />
            備註： {props.comment} <br />
        </div>
    );
}

function RenderStep3(props) {
    return (
        <div>
            {props.done ? `申報時間：` + props.todayDateTime : null}
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
