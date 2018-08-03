const express = require('express');
const app = express();
const path = require('path');
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://eqnmvgipewyrfb:75fd48a70d531caaaac72395503be88acbfb7a99afb9b92c42d7879052967e26@ec2-54-243-193-227.compute-1.amazonaws.com:5432/d25naprtgh9cku?ssl=true';
require('newrelic');

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
        SELECT data.post_id, office.postname, data.case_amount, data.case_count, data.created_date
          FROM "public"."postoffice" office
         INNER JOIN 
            (
                SELECT post_id, SUM(case_amount) case_amount, SUM(case_count) case_count,  (select max(created_date) from "public"."dailydata") created_date
                  FROM "public"."dailydata" daily
                 WHERE to_char(created_date, 'YYYY-MM') = $1
                 GROUP BY daily.post_id
            ) data on data.post_id = office.postid
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

app.get('/api/v1/getChartsData', function (req, res) {
    const client = new Client({
        connectionString: connectionString,
    });

    var CREATED_DATE = req.query.created_date;
    var ClickPostID = req.query.clickPostID;

    client.connect();

    const sql =
    `
    SELECT SUM(case_amount) total_case_amount, SUM(case_count) total_case_count, TO_CHAR(created_date, 'YYYY-MM-DD') created_date
      FROM "public"."dailydata"
     WHERE TO_CHAR(created_date, 'YYYY-MM') = $1
     GROUP BY TO_CHAR(created_date, 'YYYY-MM-DD')
     UNION
    SELECT SUM(case_amount) total_case_amount, SUM(case_count) total_case_count, TO_CHAR(created_date, 'YYYY-MM-DD') created_date
      FROM "public"."dailyinput" data
     WHERE TO_CHAR(created_date, 'YYYY-MM-DD') = $2
       AND created_date = (
           SELECT MAX(created_date)
             FROM "public"."dailyinput"
            WHERE post_id = data.post_id
    )
     GROUP BY TO_CHAR(created_date, 'YYYY-MM-DD')
     ORDER BY created_date
    `;

    const sql2 =
    `
    select total_case_amount, total_case_count, case_amount, case_count, data.created_date
    from (
         SELECT SUM(case_amount) total_case_amount, SUM(case_count) total_case_count, TO_CHAR(created_date, 'YYYY-MM-DD') created_date
       FROM "public"."dailydata"
      WHERE TO_CHAR(created_date, 'YYYY-MM') = $1
      GROUP BY TO_CHAR(created_date, 'YYYY-MM-DD')
     UNION
     SELECT SUM(case_amount) total_case_amount, SUM(case_count) total_case_count, TO_CHAR(created_date, 'YYYY-MM-DD') created_date
       FROM "public"."dailyinput" data
      WHERE TO_CHAR(created_date, 'YYYY-MM-DD') = $2
        AND created_date = (
                 SELECT MAX(created_date)
                     FROM "public"."dailyinput"
                     WHERE post_id = data.post_id
             )
      GROUP BY TO_CHAR(created_date, 'YYYY-MM-DD')
      ) 
      data
      LEFT JOIN 
      (
         SELECT SUM(case_amount) case_amount, SUM(case_count) case_count, TO_CHAR(created_date, 'YYYY-MM-DD') created_date
           FROM "public"."dailydata"
          WHERE TO_CHAR(created_date, 'YYYY-MM') = $1
            AND post_id = $3
          GROUP BY TO_CHAR(created_date, 'YYYY-MM-DD')
          UNION
          SELECT case_amount, case_count, TO_CHAR(created_date, 'YYYY-MM-DD') created_date
            FROM "public"."dailyinput"
           WHERE TO_CHAR(created_date, 'YYYY-MM-DD') = $2
            AND created_date = (
                     SELECT MAX(created_date)
                       FROM "public"."dailyinput"
                      WHERE post_id = $3
                 )
      ) officedata on officedata.created_date = data.created_date
      ORDER BY data.created_date
    `;

    var inputSQL = sql;
    var inputARRAY = [CREATED_DATE.substring(0, 7), CREATED_DATE];
    
    if(ClickPostID !== '0'){
        inputSQL = sql2;
        inputARRAY = [CREATED_DATE.substring(0, 7), CREATED_DATE, ClickPostID];
    }

    const query = client.query(inputSQL, inputARRAY, (err, clientRes) => {

        client.end();

        if (err) {
            return err.stack
        }

        return res.json(clientRes.rows)
    })
    
});

process.env.TZ = 'Asia/Taipei';
var port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0");