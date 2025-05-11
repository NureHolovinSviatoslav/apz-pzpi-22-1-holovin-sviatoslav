#!/usr/bin/env bash

cd fe
npm run build
cp -r dist/. ../../../docs

cd ../../../

git add .
git commit -m "Release version $(date '+%Y-%m-%d %H:%M:%S')"
git push
