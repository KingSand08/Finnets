#!/bin/bash
# Start up the all networks prior to running instances
./start-nets.sh
# Start up the db instance
./start-db.sh
# Start up the dev demo instance
./start-dev.sh
# Start up the prod demo instance
./start-prod.sh
echo '✅ Finished setting up dev and prod demos!'

