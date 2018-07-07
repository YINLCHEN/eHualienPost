import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import ChipComponent from 'epost/src/components/DailyInput/ChipComponent';

const styles = theme => ({
    root: {
        width: '100%',
    }
});

class App extends React.Component {
    render() {
        const { classes } = this.props;
        const labelProps = {};
        labelProps.error = true;
        
        return (
            <div className={classes.root}>
                <Stepper activeStep={0} orientation="vertical">
                    <Step>
                        <StepLabel {...labelProps}>今日未申報支局：</StepLabel>
                        <StepContent>
                            <ChipComponent mode="dashboard" />
                        </StepContent>
                    </Step>
                </Stepper>
            </div>
        );
    }
}

export default withStyles(styles)(App);