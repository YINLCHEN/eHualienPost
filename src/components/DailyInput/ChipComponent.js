import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import axios from 'axios';
import { connect } from 'react-redux';
import { compose } from "recompose";

const staticData = [
    { 'postname': '花蓮國安郵局', 'postid': '901', 'ischecked': false },
    { 'postname': '花蓮舊車站郵局', 'postid': '1', 'ischecked': false },
    { 'postname': '花蓮南京街郵局', 'postid': '2', 'ischecked': false },
    { 'postname': '新城北埔郵局', 'postid': '4', 'ischecked': false },
    { 'postname': '秀林天祥郵局', 'postid': '5', 'ischecked': false },
    { 'postname': '新城郵局', 'postid': '6', 'ischecked': false },
    { 'postname': '花蓮府前路郵局', 'postid': '7', 'ischecked': false },
    { 'postname': '吉安郵局', 'postid': '8', 'ischecked': false },
    { 'postname': '花蓮下美崙郵局', 'postid': '9', 'ischecked': false },
    { 'postname': '吉安仁里郵局', 'postid': '10', 'ischecked': false },

    { 'postname': '花蓮港務局郵局', 'postid': '11', 'ischecked': false },
    { 'postname': '秀林和平郵局', 'postid': '12', 'ischecked': false },
    { 'postname': '花蓮中華路郵局', 'postid': '13', 'ischecked': false },
    { 'postname': '花蓮富國路郵局', 'postid': '14', 'ischecked': false },
    { 'postname': '壽豐郵局', 'postid': '15', 'ischecked': false },
    { 'postname': '壽豐豐田郵局', 'postid': '16', 'ischecked': false },
    { 'postname': '壽豐志學郵局', 'postid': '17', 'ischecked': false },
    { 'postname': '吉安宜昌郵局', 'postid': '18', 'ischecked': false },
    { 'postname': '花蓮中山路郵局', 'postid': '19', 'ischecked': false },
    { 'postname': '花蓮師院郵局', 'postid': '20', 'ischecked': false },

    { 'postname': '吉安太昌郵局', 'postid': '21', 'ischecked': false },
    { 'postname': '鳳林郵局', 'postid': '22', 'ischecked': false },
    { 'postname': '鳳林萬榮郵局', 'postid': '23', 'ischecked': false },
    { 'postname': '鳳林林榮郵局', 'postid': '24', 'ischecked': false },
    { 'postname': '光復郵局', 'postid': '25', 'ischecked': false },
    { 'postname': '豐濱郵局', 'postid': '27', 'ischecked': false },
    { 'postname': '光復富田郵局', 'postid': '28', 'ischecked': false },
    { 'postname': '瑞穗郵局', 'postid': '29', 'ischecked': false },
    { 'postname': '瑞穗富源郵局', 'postid': '30', 'ischecked': false },
    { 'postname': '玉里郵局', 'postid': '31', 'ischecked': false },

    { 'postname': '玉里泰昌郵局', 'postid': '32', 'ischecked': false },
    { 'postname': '卓溪郵局', 'postid': '33', 'ischecked': false },
    { 'postname': '玉里三民郵局', 'postid': '34', 'ischecked': false },
    { 'postname': '玉里新興郵局', 'postid': '35', 'ischecked': false },
    { 'postname': '富里郵局', 'postid': '36', 'ischecked': false },
    { 'postname': '富里東里郵局', 'postid': '37', 'ischecked': false },
    { 'postname': '花蓮空軍基地郵局', 'postid': '38', 'ischecked': false },
    { 'postname': '壽豐東華大學郵局', 'postid': '39', 'ischecked': false },
];

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'left',
    },
    avatarNoChecked: {
        backgroundColor: '#ff8a65',
    },
    avatarChecked: {
        backgroundColor: '#c5e1a5',
    },
    chip: {
        margin: theme.spacing.unit,
        "&:focus": {
            backgroundColor: '#d4e157',
        },
    },
    container: {
        width: 150,
        marginRight: 10,
        textAlign: 'left',
    }
});

class ChipComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: staticData
        };
        this.handleClick = this.handleClick.bind(this);
        this.tick();
    }

    tick() {
        var dateTime = new Date();
        dateTime.setHours(dateTime.getHours() + 8);
        const todayDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');

        axios.get('/api/v1/postoffice', {
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

    handleClick(postName, postID) {
        this.props.dispatch({
            type: 'ADD_Office',
            postName: postName,
            postID: postID,
        });
    }

    render() {
        const { classes } = this.props;
        var data = this.state.data;
        return (
            <div className={classes.root}>
                {
                    Object.keys(data).map((key, index) => {
                        return (
                            <div key={index} className={classes.container}>
                                <Chip
                                    clickable={true}
                                    avatar={<Avatar className={this.props.mode === 'dashboard' && !data[key].ischecked ? classes.avatarNoChecked : classes.avatarChecked}> {data[key].postid}</Avatar>}
                                    label={data[key].postname}
                                    className={classes.chip}
                                    onClick={() => this.handleClick(data[key].postname, data[key].postid)}
                                />
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        PostID: state.PostID
    };
}

ChipComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    clickable: PropTypes.bool,
};

export default compose(connect(mapStateToProps), withStyles(styles, { withTheme: true }))(ChipComponent);

