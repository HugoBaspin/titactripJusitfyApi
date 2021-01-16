#!/bin/bash
echousage()
{
	echo 'Warning: Trying to run restore script out of SQL folder.'
	exit
}

if [ ! -f 'init-database-skel.sql' ]
then
	echousage
fi
if [ ! -f 'init-basevalues.sql' ]
then
	echousage
fi
if [ ! -f 'sqlconfig.bash' ]
then
	echousage
fi

source 'sqlconfig.bash'

if [ -z "${PASS}" ]
then
    stty -echo
    read -p "Local postgres user password :" PASS; echo
    stty echo
fi

echo Checking if ${DATABASE} database already exists...
if [[ `PGPASSWORD=${PASS} ${PSQLBIN} -lqt -h ${SERVER} -U postgres -p ${PORT} | cut -d \| -f 1 | grep -w ${DATABASE} | wc -l` -eq 1 ]]; then
    echo "Database ${DATABASE} already exists. Not creating database.";
    exit 42;
fi
echo ${DATABASE} database does not exists yet. Launching creation.

PGPASSWORD=${PASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USER} -c "CREATE USER ${USRLOGIN} WITH LOGIN ENCRYPTED PASSWORD '${USRPASS}'" postgres
PGPASSWORD=${PASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USER} -c "ALTER USER ${USRLOGIN} SUPERUSER;" postgres
PGPASSWORD=${PASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USER} -c "CREATE DATABASE ${DATABASE};" postgres
PGPASSWORD=${PASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USER} -c "GRANT ALL ON DATABASE ${DATABASE} TO ${USRLOGIN};" postgres
PGPASSWORD=${PASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USER} -c "ALTER SCHEMA public OWNER TO ${USRLOGIN}" ${DATABASE}
PGPASSWORD=${USRPASS} ${PSQLBIN} -c "CREATE EXTENSION pgcrypto" -h ${SERVER} -p ${PORT} -U ${USRLOGIN} ${DATABASE}
PGPASSWORD=${USRPASS} ${PSQLBIN} -c "CREATE EXTENSION pg_trgm" -h ${SERVER} -p ${PORT} -U ${USRLOGIN} ${DATABASE}

PGPASSWORD=${USRPASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USRLOGIN} -d ${DATABASE} < init-database-skel.sql
PGPASSWORD=${USRPASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USRLOGIN} -d ${DATABASE} < init-basevalues.sql
