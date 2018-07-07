import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import { connect } from 'react-redux';
import { compose } from "recompose";

const data = [
    { 'postName': '花蓮國安郵局', 'postID': '901' },
    { 'postName': '花蓮舊車站郵局', 'postID': '1' },
    { 'postName': '花蓮南京街郵局', 'postID': '2' },
    { 'postName': '新城北埔郵局', 'postID': '4' },
    { 'postName': '秀林天祥郵局', 'postID': '5' },
    { 'postName': '新城郵局', 'postID': '6' },
    { 'postName': '花蓮府前路郵局', 'postID': '7' },
    { 'postName': '吉安郵局', 'postID': '8' },
    { 'postName': '花蓮下美崙郵局', 'postID': '9' },
    { 'postName': '吉安仁里郵局', 'postID': '10' },

    { 'postName': '花蓮港務局郵局', 'postID': '11' },
    { 'postName': '秀林和平郵局', 'postID': '12' },
    { 'postName': '花蓮中華路郵局', 'postID': '13' },
    { 'postName': '花蓮富國路郵局', 'postID': '14' },
    { 'postName': '壽豐郵局', 'postID': '15' },
    { 'postName': '壽豐豐田郵局', 'postID': '16' },
    { 'postName': '壽豐志學郵局', 'postID': '17' },
    { 'postName': '吉安宜昌郵局', 'postID': '18' },
    { 'postName': '花蓮中山路郵局', 'postID': '19' },
    { 'postName': '花蓮師院郵局', 'postID': '20' },

    { 'postName': '吉安太昌郵局', 'postID': '21' },
    { 'postName': '鳳林郵局', 'postID': '22' },
    { 'postName': '鳳林萬榮郵局', 'postID': '23' },
    { 'postName': '鳳林林榮郵局', 'postID': '24' },
    { 'postName': '光復郵局', 'postID': '25' },
    { 'postName': '豐濱郵局', 'postID': '27' },
    { 'postName': '光復富田郵局', 'postID': '28' },
    { 'postName': '瑞穗郵局', 'postID': '29' },
    { 'postName': '瑞穗富源郵局', 'postID': '30' },
    { 'postName': '玉里郵局', 'postID': '31' },

    { 'postName': '玉里泰昌郵局', 'postID': '32' },
    { 'postName': '卓溪郵局', 'postID': '33' },
    { 'postName': '玉里三民郵局', 'postID': '34' },
    { 'postName': '玉里新興郵局', 'postID': '35' },
    { 'postName': '富里郵局', 'postID': '36' },
    { 'postName': '富里東里郵局', 'postID': '37' },
    { 'postName': '花蓮空軍基地郵局', 'postID': '38' },
    { 'postName': '壽豐東華大學郵局', 'postID': '39' },
];

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'left',
    },
    avatar: {
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
            data: []
        };
        this.handleClick = this.handleClick.bind(this);
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

        const element = Object.keys(data).map((key, index) => {
            return (
                <div key={index} className={classes.container}>
                    <Chip
                        clickable={true}
                        avatar={<Avatar className={classes.avatar}>{data[key].postID}</Avatar>}
                        label={data[key].postName}
                        className={classes.chip}
                        onClick={() => this.handleClick(data[key].postName, data[key].postID)}
                    />
                </div>
            )
        });

        return (
            <div className={classes.root}>
                {element}
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
