#!/bin/bash

stage=$1
type=$2

BUILD_ROOT=/data/nodeapp/xue-frontend
RELEASE_ROOT=/data/nodeapp
output_dirname="build-$stage"

# xuestatic 目录
cd $BUILD_ROOT/nodeapp
npm run sapp

cd $BUILD_ROOT

# if [ -f $RELEASE_ROOT/update_log.json ]; then
#     rsync -rtvlpgozDP --exclude .svn nodeapp/ $RELEASE_ROOT
#     echo "更新静态和template"
# else
rsync -rtvlpgozDP --exclude .svn nodeapp/ $RELEASE_ROOT
echo "更新template!"
# fi

cd $RELEASE_ROOT

# rm -r update_log.json

maxNode=4

if [ "$stage" = "production" ]; then
    maxNode=8
fi

PM2_PARAMS="--log-date-format 'YYYY-MM-DD HH:mm:ss' --no-color --output /dev/null"

if [ "$type" = "start" ]; then
    pm2 start app.js $PM2_PARAMS -i $maxNode
else
    pm2 reload all $PM2_PARAMS
fi
