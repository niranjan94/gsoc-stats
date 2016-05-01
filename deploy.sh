#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

git config --global user.email "Niranjan Rajendran"
git config --global user.name "niranjan94@yahoo.com"

git clone "https://$GH_TOKEN@github.com/niranjan94/gsoc-stats.git" gh-pages
cd gh-pages
git checkout gh-pages
yes | cp -rf  ../out/* out/
git add .
git commit -m "[${rev}] Update generated statistics"
git push -q origin gh-pages