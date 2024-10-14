#!/bin/sh
# wait-for.sh

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until mysql -h"$host" -P"$port" -uroot -p${MYSQL_ROOT_PASSWORD} &> /dev/null
do
  echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd