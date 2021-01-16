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

if [[ `PGPASSWORD=${PASS} ${PSQLBIN} -lqt -h ${SERVER} -U postgres -p ${PORT} | cut -d \| -f 1 | grep -w ${DATABASE} | wc -l` -eq 1 ]]; then
    echo "Resetting database.";
else
    echo "Database ${DATABASE} does not exists. Aborting database reset.";
    exit 42;
fi

PGPASSWORD=${USRPASS} ${PSQLBIN} -c "DROP SCHEMA public CASCADE" -h ${SERVER} -p ${PORT} -U ${USRLOGIN} ${DATABASE}
PGPASSWORD=${USRPASS} ${PSQLBIN} -c "CREATE SCHEMA public AUTHORIZATION ${USRLOGIN}" -h ${SERVER} -p ${PORT} -U ${USRLOGIN} ${DATABASE}
PGPASSWORD=${USRPASS} ${PSQLBIN} -c "CREATE EXTENSION pgcrypto" -h ${SERVER} -p ${PORT} -U ${USRLOGIN} ${DATABASE}
PGPASSWORD=${USRPASS} ${PSQLBIN} -c "CREATE EXTENSION pg_trgm" -h ${SERVER} -p ${PORT} -U ${USRLOGIN} ${DATABASE}
PGPASSWORD=${USRPASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USRLOGIN} -d ${DATABASE} < init-database-skel.sql
PGPASSWORD=${USRPASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USRLOGIN} -d ${DATABASE} < init-basevalues.sql
