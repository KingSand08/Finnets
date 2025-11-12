#!/usr/bin/env bash
set -a
source "$(dirname "$0")/../../.env"
set +a

docker exec -it mock_bank_database mysql -uroot -p"$DB_PASS" -e "
USE Finnets;
SELECT A.account_number, A.type AS account_type, A.balance
    FROM Customers C
    LEFT JOIN Accounts A
    ON C.cid = A.cid
    WHERE C.username = 'johndoe';"