echo $PATH
node -v

#!/bin/bash

stage=$1

build_repo="build-repo"
output_dirname="build-test"

DIR=/var/lib/jenkins/workspace/17xue-frontend
cd $DIR

# 安装 package
cnpm install

# 编译static 资源
npm run build_server

echo "run_build_done"

# 替换env.json 中的__STAGE__变量
cd $DIR
sed "s/_____stage_____/$stage/g" config/env-config.json > config/env.json
echo -e  '--------- replace __STAGE__ to '$stage' successful  ---------\n'

cd $DIR
BUILD_ROOT=$DIR/$build_repo/$output_dirname

# 创建svn 库
cd $DIR
create_svn_file=$build_repo/$output_dirname/nodeAppServer

mkdir -p $create_svn_file

# 同步到svn 文件夹
cp -rf $DIR/{dist,config,controller,views,app.js,gulpfile.js,package.json} $create_svn_file
# rsync -rtvlpgozDP --delete --exclude .git $DIR/{dist,config,controller,views,app.js,gulpfile.js,package.json, proxy.js} $create_svn_file