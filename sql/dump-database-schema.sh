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

#stty -echo
#read -p "Password: " PASS; echo
#stty echo

source 'sqlconfig.bash'

PGPASSWORD=${USRPASS} ${PGDUMPBIN} -Ox -s -b -h ${SERVER} -p ${PORT} -n public -U ${USRLOGIN} ${DATABASE} -f init-database-skel.sql
