import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import ChipComponent from './ChipComponent';

import PropTypes from "prop-types";
// @material-ui/core
import Grid from "@material-ui/core/Grid";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import InfoOutline from "@material-ui/icons/InfoOutline";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import ContentCopy from "@material-ui/icons/ContentCopy";
import Accessibility from "@material-ui/icons/Accessibility";
import Update from "@material-ui/icons/Update";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import AnimationCharts from './AnimationCharts';

class App extends React.Component {
    render() {
        const { classes } = this.props;
        const labelProps = {};
        labelProps.error = true;
        const dateTime = new Date();

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

                <Grid container>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="success" stats icon>
                                <CardIcon color="success">
                                    <Store />
                                </CardIcon>
                                <p className={classes.cardCategory}>今日營業額</p>
                                <h1 className={classes.cardTitle}>$34,245</h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <DateRange />
                                    {dateTime.toLocaleDateString()}
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="warning" stats icon>
                                <CardIcon color="warning">
                                    <ContentCopy />
                                </CardIcon>
                                <p className={classes.cardCategory}>今日件數</p>
                                <h1 className={classes.cardTitle}>
                                    52
                                </h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <DateRange />
                                    {dateTime.toLocaleDateString()}
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="info" stats icon>
                                <CardIcon color="info">
                                    <Accessibility />
                                </CardIcon>
                                <p className={classes.cardCategory}>今日支局備註</p>
                                <h1 className={classes.cardTitle}>+2</h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <Update />
                                    Just Updated
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="danger" stats icon>
                                <CardIcon color="danger">
                                    <InfoOutline />
                                </CardIcon>
                                <p className={classes.cardCategory}>今日未申報支局</p>
                                <h1 className={classes.cardTitle}>30</h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <LocalOffer />
                                    {dateTime.toLocaleDateString()}
                                </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                </Grid>

                <AnimationCharts />

                <Grid container>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="rose">
                                <h3 className={classes.cardTitleWhite}>今日各支局申報資料</h3>
                                <p className={classes.cardCategoryWhite}>{dateTime.toLocaleDateString()}</p>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    tableHeaderColor="warning"
                                    tableHead={["ID", "Name", "Salary", "Country"]}
                                    tableData={[
                                        ["1", "Dakota Rice", "$36,738", "Niger"],
                                        ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                                        ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                                        ["4", "Philip Chaney", "$38,735", "Korea, South"]
                                    ]}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={6}>
                        <CustomTabs
                            title="統計資料"
                            headerColor="primary"
                            tabs={[
                                {
                                    tabName: "週統計",
                                    tabIcon: BugReport,
                                    tabContent: (
                                        <Table
                                            tableHeaderColor="warning"
                                            tableHead={["ID", "Name", "Salary", "Country"]}
                                            tableData={[
                                                ["1", "Dakota Rice", "$36,738", "Niger"],
                                                ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                                                ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                                                ["4", "Philip Chaney", "$38,735", "Korea, South"]
                                            ]}
                                        />
                                    )
                                },
                                {
                                    tabName: "月統計",
                                    tabIcon: Code,
                                    tabContent: (
                                        <Table
                                            tableHeaderColor="warning"
                                            tableHead={["ID", "Name", "Salary", "Country"]}
                                            tableData={[
                                                ["1", "Dakota Rice", "$56,738", "Niger"],
                                                ["2", "Minerva Hooper", "$89,789", "Curaçao"],
                                                ["3", "Sage Rodriguez", "$15,142", "Netherlands"],
                                                ["4", "Philip Chaney", "$30,735", "Korea, South"]
                                            ]}
                                        />
                                    )
                                },
                                {
                                    tabName: "年統計",
                                    tabIcon: Cloud,
                                    tabContent: (
                                        <Table
                                            tableHeaderColor="warning"
                                            tableHead={["ID", "Name", "Salary", "Country"]}
                                            tableData={[
                                                ["1", "Dakota Rice", "$12356,738", "Niger"],
                                                ["2", "Minerva Hooper", "$2389,789", "Curaçao"],
                                                ["3", "Sage Rodriguez", "$2315,142", "Netherlands"],
                                                ["4", "Philip Chaney", "$3230,735", "Korea, South"]
                                            ]}
                                        />
                                    )
                                }
                            ]}
                        />
                    </GridItem>
                </Grid>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(App);