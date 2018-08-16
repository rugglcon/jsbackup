#!/usr/bin/env bash

VERSION=""

npm run ci
if [ $? -ne 0 ]; then
    echo "Build failed. Exiting."
    exit 1
fi

echo "Deploy process started"
echo ""

read -e -p 'Enter version type (major, minor, patch): ' VERSION

if [ "$VERSION" = "major" ]; then
    npm version major
elif [ "$VERSION" = "minor" ]; then
    npm version minor
elif [ "$VERSION" = "patch" ]; then
    npm version patch
else
    echo "incorrect version option."
    exit 1
fi
if [ $? -ne 0 ]; then
    echo "npm error"
    exit 1
fi
echo "yay"
exit

git push --tags

npm publish