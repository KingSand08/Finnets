#!/usr/bin/env bash
set -a
source "$(dirname "$0")/../../../.env"
set +a

docker exec -it mock_bank_database mysql -uroot -p"$DATABASE_PASS" -e "
    USE Finnets;
    SELECT a.aid, c.cid, c.first_name, c.last_name, a.account_number, a.balance, a.type, e.email_address
    FROM Accounts AS a
    JOIN Customers AS c
        ON a.cid=c.cid
    JOIN Emails AS e
        ON c.cid=e.cid
    ORDER BY 
        c.cid DESC,
        a.type DESC,
        a.balance DESC;"