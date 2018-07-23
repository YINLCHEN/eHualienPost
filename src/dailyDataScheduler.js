const express = require('express');
const app = express();
const path = require('path');
const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://eqnmvgipewyrfb:75fd48a70d531caaaac72395503be88acbfb7a99afb9b92c42d7879052967e26@ec2-54-243-193-227.compute-1.amazonaws.com:5432/d25naprtgh9cku?ssl=true';

run();

function run() {
    const client = new Client({
        connectionString: connectionString,
    });

    client.connect();

    const sql =
        `
        INSERT INTO "public"."dailydata" (post_id, case_amount, case_count, created_date)
        SELECT post_id, case_amount, case_count, current_timestamp + INTERVAL '8 hour'
          FROM "public"."dailyinput" daily
         INNER JOIN postoffice office on office.postid = daily.post_id
         WHERE to_char(created_date, 'YYYY-MM-DD') =  to_char(current_timestamp + INTERVAL '8 hour', 'YYYY-MM-DD')
           AND created_date = (
                    SELECT MAX(created_date)
                      FROM "public"."dailyinput"
                     WHERE post_id = daily.post_id
                )`;

    const query = client.query(sql, (err, clientRes) => {

        client.end();

        if (err) {
            console.log(err.stack)
        }

        console.log(clientRes.rows)
    })
};
