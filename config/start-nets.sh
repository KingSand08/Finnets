#!/bin/bash
set -e

if docker network inspect bank_shared_net >/dev/null 2>&1; then
  echo "bank_shared_net already exists"
else
  docker network create bank_shared_net >/dev/null
  echo "Created bank_shared_net"
fi

if docker network inspect bank_dev_net >/dev/null 2>&1; then
  echo "bank_dev_net already exists"
else
  docker network create bank_dev_net >/dev/null
  echo "Created bank_dev_net"
fi

if docker network inspect bank_prod_net >/dev/null 2>&1; then
  echo "bank_prod_net already exists"
else
  docker network create bank_prod_net >/dev/null
  echo "Created bank_prod_net"
fi

