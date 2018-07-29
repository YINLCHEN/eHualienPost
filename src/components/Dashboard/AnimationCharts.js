import React, { Component } from 'react';
import AmCharts from "@amcharts/amcharts3-react";
import axios from 'axios';

import 'css/Charts.css';

/*
// Generate random data
function generateData() {
    var chartData = [{
        "date": "2012-01-01",
        "distance": 227,
        "townName": "New York",
        "townName2": "New York",
        "townSize": 25,
        "latitude": 40.71,
        "duration": 408
    }, {
        "date": "2012-01-02",
        "distance": 371,
        "townName": "Washington",
        "townSize": 14,
        "latitude": 38.89,
        "duration": 482
    }, {
        "date": "2012-01-03",
        "distance": 433,
        "townName": "Wilmington",
        "townSize": 6,
        "latitude": 34.22,
        "duration": 562
    }, {
        "date": "2012-01-04",
        "distance": 345,
        "townName": "Jacksonville",
        "townSize": 7,
        "latitude": 30.35,
        "duration": 379
    }, {
        "date": "2012-01-05",
        "distance": 480,
        "townName": "Miami",
        "townName2": "Miami",
        "townSize": 10,
        "latitude": 25.83,
        "duration": 501
    }, {
        "date": "2012-01-06",
        "distance": 386,
        "townName": "Tallahassee",
        "townSize": 7,
        "latitude": 30.46,
        "duration": 443
    }, {
        "date": "2012-01-07",
        "distance": 348,
        "townName": "New Orleans",
        "townSize": 10,
        "latitude": 29.94,
        "duration": 405
    }, {
        "date": "2012-01-08",
        "distance": 238,
        "townName": "Houston",
        "townName2": "Houston",
        "townSize": 16,
        "latitude": 29.76,
        "duration": 309
    }, {
        "date": "2012-01-09",
        "distance": 218,
        "townName": "Dalas",
        "townSize": 17,
        "latitude": 32.8,
        "duration": 287
    }, {
        "date": "2012-01-10",
        "distance": 349,
        "townName": "Oklahoma City",
        "townSize": 11,
        "latitude": 35.49,
        "duration": 485
    }, {
        "date": "2012-01-11",
        "distance": 603,
        "townName": "Kansas City",
        "townSize": 10,
        "latitude": 39.1,
        "duration": 890
    }, {
        "date": "2012-01-12",
        "distance": 534,
        "townName": "Denver",
        "townName2": "Denver",
        "townSize": 18,
        "latitude": 39.74,
        "duration": 810
    }, {
        "date": "2012-01-13",
        "townName": "Salt Lake City",
        "townSize": 12,
        "distance": 425,
        "duration": 670,
        "latitude": 40.75,
        "alpha": 0.4
    }, {
        "date": "2012-01-14",
        "latitude": 36.1,
        "duration": 470,
        "townName": "Las Vegas",
        "townName2": "Las Vegas",
        "bulletClass": "lastBullet"
    }, {
        "date": "2012-01-15"
    }, {
        "date": "2012-01-16"
    }, {
        "date": "2012-01-17"
    }, {
        "date": "2012-01-18"
    }, {
        "date": "2012-01-19"
    }];

    return chartData;
}
*/

// Component which contains the dynamic state for the chart
class AnimationCharts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataProvider: [],
            timer: null,
            clickPostID: props.clickPostID
        };

        this.getChartsData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clickPostID !== undefined && this.state.clickPostID !== nextProps.clickPostID) {
            this.setState({
                clickPostID: nextProps.clickPostID,
                clickPostName: nextProps.clickPostName
            })
            this.getChartsData();
        }
    }

    componentDidMount() {
        this.setState({
            timer: setInterval(
                () => this.getChartsData(), 5000
            )
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    getChartsData() {
        var dateTime = new Date();
        dateTime.setHours(dateTime.getHours() + 8);
        const todayDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');

        axios.get('/api/v1/getChartsData', {
            params: {
                created_date: todayDateTime.substring(0, 10),
                clickPostID: this.state.clickPostID
            }
        })
            .then(res => {
                const data = res.data;
                let arrayList = [];

                Object.keys(data).map((ikey, index) => {

                    var json = {};
                    if (this.state.clickPostID === 0) {
                        if (index + 1 === data.length) {
                            json = {
                                "date": data[ikey].created_date,
                                "distance": data[ikey].total_case_amount,
                                "townName": "全部支局",
                                "townName2": "",
                                "townSize": 25,
                                "alpha": 0.4,
                                "duration": data[ikey].total_case_count,
                                "bulletClass": "lastBullet"
                            }
                        }
                        else {
                            json = {
                                "date": data[ikey].created_date,
                                "distance": data[ikey].total_case_amount,
                                "townName": "全部支局",
                                "townName2": "",
                                "townSize": 25,
                                "duration": data[ikey].total_case_count
                            }
                        }
                    }
                    else {
                        if (index + 1 === data.length) {
                            json = {
                                "date": data[ikey].created_date,
                                "distance": data[ikey].total_case_amount,
                                "townName": this.state.clickPostName,
                                "townName2": "",
                                "townSize": 10,
                                "latitude": data[ikey].case_amount,
                                "alpha": 0.4,
                                "duration": data[ikey].total_case_count,
                                "bulletClass": "lastBullet"
                            }
                        }
                        else {
                            json = {
                                "date": data[ikey].created_date,
                                "distance": data[ikey].total_case_amount,
                                "townName": this.state.clickPostName,
                                "townName2": "",
                                "townSize": 10,
                                "latitude": data[ikey].case_amount,
                                "duration": data[ikey].total_case_count
                            }
                        }
                    }

                    arrayList.push(json);

                    return null;
                });

                var currentDate = new Date();
                currentDate.setHours(currentDate.getHours() + 8);
                currentDate.setDate(currentDate.getDate() + 1);

                arrayList.push({
                    "date": currentDate.toISOString().slice(0, 10).replace('T', ' ')
                });

                this.setState({
                    dataProvider: arrayList
                })
            })
    }

    render() {
        const config = {
            "type": "serial",
            "theme": "none",
            "hideCredits": true,
            "dataDateFormat": "YYYY-MM-DD",
            "dataProvider": this.state.dataProvider,
            "addClassNames": true,
            "startDuration": 1,
            //"color": "#FFFFFF",
            "marginLeft": 0,

            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "minPeriod": "DD",
                "autoGridCount": false,
                "gridCount": 50,
                "gridAlpha": 0.1,
                "gridColor": "#FFFFFF",
                "axisColor": "#555555",
                "dateFormats": [{
                    "period": 'DD',
                    "format": 'DD'
                }, {
                    "period": 'WW',
                    "format": 'MMM DD'
                }, {
                    "period": 'MM',
                    "format": 'MMM'
                }, {
                    "period": 'YYYY',
                    "format": 'YYYY'
                }]
            },

            "valueAxes": [{
                "id": "a1",
                "title": "營業額",
                "gridAlpha": 0,
                "axisAlpha": 0
            }, {
                "id": "a2",
                "position": "right",
                "gridAlpha": 0,
                "axisAlpha": 0,
                "labelsEnabled": false
            }, {
                "id": "a3",
                "title": "件數",
                "position": "right",
                "gridAlpha": 0,
                "axisAlpha": 0,
                "inside": true,
            }],

            "graphs": [{
                "id": "g1",
                "valueField": "distance",
                "title": "營業額",
                "type": "column",
                "fillAlphas": 0.9,
                "valueAxis": "a1",
                "balloonText": "總營業額＄[[value]]",
                "legendValueText": "＄[[value]]",
                "legendPeriodValueText": "＄[[value.sum]]",
                "lineColor": "#263138",
                "alphaField": "alpha"
            }, {
                "id": "g2",
                "valueField": "latitude",
                "classNameField": "bulletClass",
                "title": "支局",
                "type": "line",
                "valueAxis": "a2",
                "lineColor": "#786c56",
                "lineThickness": 1,
                "legendValueText": "[[value]]/[[description]]",
                "descriptionField": "townName",
                "bullet": "round",
                "bulletSizeField": "townSize",
                "bulletBorderColor": "#786c56",
                "bulletBorderAlpha": 1,
                "bulletBorderThickness": 2,
                "bulletColor": "#000000",
                "labelText": "[[townName2]]",
                "labelPosition": "right",
                "balloonText": this.state.clickPostName + "＄[[value]]",
                "showBalloon": true,
                "animationPlayed": true
            }, {
                "id": "g3",
                "title": "件數",
                "valueField": "duration",
                "type": "line",
                "valueAxis": "a3",
                "lineColor": "#ff5755",
                "balloonText": "總件數 [[value]]",
                "lineThickness": 1,
                "legendValueText": "[[value]]",
                "bullet": "square",
                "bulletBorderColor": "#ff5755",
                "bulletBorderThickness": 1,
                "bulletBorderAlpha": 1,
                "dashLengthField": "dashLength",
                "animationPlayed": true
            }],
            "chartCursor": {
                "zoomable": false,
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0,
                "valueBalloonsEnabled": false
            },
            "legend": {
                "bulletType": "round",
                "equalWidths": false,
                "valueWidth": 120,
                "useGraphSettings": true,
                //"color": "#FFFFFF"
            }
        };

        return (
            <div className="App">
                <AmCharts.React style={{ width: "100%", height: "500px" }} options={config} />
            </div>
        );
    }
}

export default AnimationCharts;