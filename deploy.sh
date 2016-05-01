#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

git config --global user.email user.name "Niranjan Rajendran"
git config --global user.name user.email "niranjan94@yahoo.com"

git clone "https://$GH_TOKEN@github.com/niranjan94/gsoc-stats.git" gh-pages
yes | cp -rf  out/* gh-pages/out/
cd gh-pages
git add .
git commit -m "[${rev}] Update generated statistics"
git push origin gh-pages