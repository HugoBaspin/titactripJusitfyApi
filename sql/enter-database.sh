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
    echo "Entering database.";
else
    echo "Database ${DATABASE} does not exists. Aborting database connection.";
    exit 42;
fi

PGPASSWORD=${USRPASS} ${PSQLBIN} -h ${SERVER} -p ${PORT} -U ${USRLOGIN} -d ${DATABASE}
