import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
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

import IconButton from '@material-ui/core/IconButton';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import ChipComponent from './ChipComponent';
import AnimationCharts from './AnimationCharts';

import { connect } from 'react-redux';
import { compose } from "recompose";
import axios from 'axios';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            clickPostID: 0,
            yesterdayData: [],
            monthData: [],
        }
        this.tick();
        this.getYesterdayData();
        this.getMonthData();
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(), 5000
        );
    }

    tick() {
        var dateTime = new Date();
        dateTime.setHours(dateTime.getHours() + 8);
        const todayDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');

        axios.get('/api/v1/getDashboardInfo', {
            params: {
                created_date: todayDateTime.substring(0, 10)
            }
        })
            .then(res => {
                this.setState({
                    data: res.data
                });
            })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.PostID !== undefined) {
            this.setState({
                clickPostID: nextProps.PostID
            })
        }
    }

    handleClick() {
        this.setState({
            clickPostID: 0
        })
    }

    getYesterdayData() {
        var dateTime = new Date();
        dateTime.setDate(dateTime.getDate() - 1);
        dateTime.setHours(dateTime.getHours() + 8);
        const todayDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');

        axios.get('/api/v1/getDashboardInfo', {
            params: {
                created_date: todayDateTime.substring(0, 10)
            }
        })
            .then(res => {
                const data = res.data;
                let arrayList = [];

                Object.keys(data).map((ikey, index) => {
                    var array = [];
                    array.push(data[ikey].post_id.toString());
                    array.push(data[ikey].postname);
                    array.push(data[ikey].case_amount.toString());
                    array.push(data[ikey].case_count.toString());
                    array.push(data[ikey].case_comment);

                    var d = new Date(data[ikey].created_date);
                    array.push(d.toLocaleDateString() + ' ' + d.toLocaleTimeString());

                    arrayList.push(array);

                    return null;
                });

                this.setState({
                    yesterdayData: arrayList
                })
            })
    }

    getMonthData() {
        var dateTime = new Date();
        dateTime.setHours(dateTime.getHours() + 8);
        const todayDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');
      
        axios.get('/api/v1/getMonthData', {
            params: {
                created_date: todayDateTime.substring(0, 7)
            }
        })
            .then(res => {
                const data = res.data;
                let arrayList = [];

                Object.keys(data).map((ikey, index) => {
                    var array = [];
                    array.push(data[ikey].post_id.toString());
                    array.push(data[ikey].postname);
                    array.push(data[ikey].case_amount.toString());
                    array.push(data[ikey].case_count.toString());
                    array.push(todayDateTime.substring(0, 7));

                    arrayList.push(array);

                    return null;
                });

                this.setState({
                    monthData: arrayList
                })
            })
    }

    render() {
        const { classes } = this.props;
        const labelProps = {};
        labelProps.error = true;
        const dateTime = new Date();

        let CaseAmount = 0; //營業額
        let CaseCount = 0; //件數
        let CaseComment = 0; //備註數
        let NonChecked = 38; //未申報支局數
        let arrayList = []; //今日各支局申報資料

        let data = this.state.data;
        Object.keys(data).map((ikey, index) => {

            if (this.state.clickPostID === 0 || this.state.clickPostID === data[ikey].post_id) {
                CaseAmount += data[ikey].case_amount;
                CaseCount += data[ikey].case_count;

                if (data[ikey].case_comment !== '') {
                    CaseComment += 1;
                }
            }

            NonChecked -= 1;

            var array = [];
            array.push(data[ikey].post_id.toString());
            array.push(data[ikey].postname);
            array.push(data[ikey].case_amount.toString());
            array.push(data[ikey].case_count.toString());
            array.push(data[ikey].case_comment);

            var d = new Date(data[ikey].created_date);
            array.push(d.toLocaleTimeString());

            arrayList.push(array);

            return null;
        });


        return (
            <div className={classes.root}>
                <Stepper activeStep={0} orientation="vertical">
                    <Step>
                        <StepLabel {...labelProps}>今日未申報支局：
                            <IconButton className={classes.button} aria-label="Delete"
                                onClick={() => this.handleClick(this)}>
                                <SettingsBackupRestoreIcon />
                            </IconButton>
                        </StepLabel>
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
                                <h1 className={classes.cardTitle}>${CaseAmount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")}</h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <DateRange />
                                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
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
                                    {CaseCount}
                                </h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <DateRange />
                                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
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
                                <h1 className={classes.cardTitle}>+{CaseComment}</h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <Update />
                                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
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
                                <h1 className={classes.cardTitle}>{NonChecked === 38 ? '-' : NonChecked}</h1>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <LocalOffer />
                                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
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
                                    tableHead={["支", "支局", "營業額", "件數", "備註", "申報時間"]}
                                    tableData={arrayList}
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
                                    tabName: "昨日各支局申報資料",
                                    tabIcon: BugReport,
                                    tabContent: (
                                        <Table
                                            tableHeaderColor="warning"
                                            tableHead={["支", "支局", "營業額", "件數", "備註", "申報時間"]}
                                            tableData={this.state.yesterdayData}
                                        />
                                    )
                                },
                                {
                                    tabName: "月統計",
                                    tabIcon: Code,
                                    tabContent: (
                                        <Table
                                            tableHeaderColor="warning"
                                            tableHead={["支", "支局", "月營業額", "月件數", "資料時間"]}
                                            tableData={this.state.monthData}
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

function mapStateToProps(state) {
    return {
        PostID: state.PostID,
        PostName: state.PostName,
    };
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(connect(mapStateToProps), withStyles(dashboardStyle))(App);
