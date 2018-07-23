const express = require('express');
const app = express();
const path = require('path');
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://eqnmvgipewyrfb:75fd48a70d531caaaac72395503be88acbfb7a99afb9b92c42d7879052967e26@ec2-54-243-193-227.compute-1.amazonaws.com:5432/d25naprtgh9cku?ssl=true';

app.use(express.static('build'));

app.get('/', function (req, res) {
    res.sendFile(path.join('index.html'));
});

app.get('/api/v1/postoffice/', function (req, res) {
    const client = new Client({
        connectionString: connectionString,
    });

    client.connect();
    const sql =
        `SELECT 
            T1.postid, 
            T1.postname, 
            case COALESCE(T2.post_id,0)
                when 0 then False
                else True
            end as isChecked
            FROM "public"."postoffice" AS T1
            LEFT JOIN ( SELECT post_id
                FROM "public"."dailyinput" as daily
                WHERE to_char(created_date, 'YYYY-MM-DD') = $1
                AND created_date = (
                    SELECT MAX(created_date)
                    FROM "public"."dailyinput"
                    WHERE post_id = daily.post_id
                    )
            ) AS T2 on T1.postid = T2.post_id;`;

    const query = client.query(sql, [req.query.created_date], (err, clientRes) => {

        client.end();

        if (err) {
            return err.stack
        }

        return res.json(clientRes.rows)
    })
});

app.get('/api/v1/getDashboardInfo/', function (req, res) {
    const client = new Client({
        connectionString: connectionString,
    });

    client.connect();
    const sql =
        `
        SELECT post_id, office.postname, case_amount, case_count, case_comment, created_date
        FROM "public"."dailyinput" daily
        INNER JOIN postoffice office on office.postid = daily.post_id
        WHERE to_char(created_date, 'YYYY-MM-DD') = $1
               AND created_date = (
                   SELECT MAX(created_date)
                     FROM "public"."dailyinput"
                    WHERE post_id = daily.post_id
               )
        ORDER BY case_amount desc`;

    const query = client.query(sql, [req.query.created_date], (err, clientRes) => {

        client.end();

        if (err) {
            return err.stack
        }

        return res.json(clientRes.rows)
    })
});

app.get('/api/v1/getMonthData', function (req, res) {
    const client = new Client({
        connectionString: connectionString,
    });

    client.connect();
    const sql =
        `
        SELECT post_id, office.postname, SUM(case_amount) case_amount, SUM(case_count) case_count,  (select max(created_date) from "public"."dailydata") created_date
        FROM "public"."dailydata" daily
        INNER JOIN postoffice office on office.postid = daily.post_id
        WHERE to_char(created_date, 'YYYY-MM') = $1
        GROUP BY daily.post_id, office.postname, daily.case_amount, daily.case_count
        ORDER BY case_amount desc`;

    const query = client.query(sql, [req.query.created_date], (err, clientRes) => {

        client.end();

        if (err) {
            return err.stack
        }

        return res.json(clientRes.rows)
    })
});

app.get('/api/v1/insertDailyInput/', function (req, res) {
    var POST_ID = Number(req.query.post_id);
    var CASE_AMOUNT = Number(req.query.case_amount);
    var CASE_COUNT = Number(req.query.case_count);
    var CASE_COMMENT = req.query.case_comment;
    var CREATED_DATE = req.query.created_date;

    const client = new Client({
        connectionString: connectionString,
    });

    client.connect();

    const query = client.query('INSERT INTO DAILYINPUT (POST_ID, CASE_AMOUNT, CASE_COUNT, CASE_COMMENT, CREATED_DATE) VALUES ($1, $2, $3, $4, $5)',
        [POST_ID, CASE_AMOUNT, CASE_COUNT, CASE_COMMENT, CREATED_DATE], (err, result) => {

            client.end();

            if (err) {
                return err.stack
            }

            return res.json(result.rowCount)
        })
});

process.env.TZ = 'Asia/Taipei';
var port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0");