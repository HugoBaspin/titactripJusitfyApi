#!/bin/bash
# Database Environment
# local: local PostgreSQL development environment
# test: Gitlab test environment
# dev: Amazon RDS PostgreSQL development environment
# staging: Amazon RDS PostgreSQL staging environment
# prod: Amazon RDS PostgreSQL production environment
# Defaults to local

echo 'ENV value: '${ENV}

if [ -z "${ENV}" ]
then
	echo "Defaulting to local"
	ENV=local
elif [ "${ENV}" = "local" ] &&
	 [ "${ENV}" = "dev" ]
then
	echo 'Invalid environment'
	exit 42
fi;

export $(cat .env-${ENV} | sed 's/#.*//g' | xargs)

if [ "${ENV}" = "local" ]
then
	ping -c 1 ${SERVER} > /dev/null
	if [ $? -ne 0 ]
	then
		echo 'Server '${SERVER}' is unknown or unreachable.'
		exit 42;
	fi
fi

if [ -z "${PROGRAMW6432}" ]
then
    if [ "${ENV}" = "local" ]
    then
        LASTVERSIONLINE=`ls -d /Applications/mappstack-7.*.* | cut -d '/' -f 3 | wc -l | rev | cut -d ' ' -f 1 | rev`
        VERSION=`ls -d /Applications/mappstack-7.*.* | cut -d '/' -f 3 | sed -n ${LASTVERSIONLINE},${LASTVERSIONLINE}p`
        PGDUMPBIN="/Applications/${VERSION}/postgresql/bin/pg_dump"
        PSQLBIN="/Applications/${VERSION}/postgresql/bin/psql"
    else
        PGDUMPBIN="pg_dump"
        PSQLBIN="psql"
    fi
else
	VERSION="wappstack-7.4.6-0"
	PGDUMPBIN="/c/Bitnami/${VERSION}/postgresql/bin/pg_dump"
	PSQLBIN="/c/Bitnami/${VERSION}/postgresql/bin/psql"
fi
