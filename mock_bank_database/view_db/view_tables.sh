#!/usr/bin/env bash
set -a
source "$(dirname "$0")/../../.env"
set +a

docker exec -it mock_bank_database mysql -uroot -p"$DB_PASS" -e "SHOW TABLES FROM Finnets;"