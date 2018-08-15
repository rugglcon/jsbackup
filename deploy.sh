#!/usr/bin/env bash

TAG=""
MESSAGE=""

npm run ci
if [ $? -neq 0 ]; then
    "Build failed. Exiting."
fi

echo "Deploy process started"
echo ""

echo "Did you update the version in package.json?"
read -p "Press [Enter] if you did."

read -e -p 'Enter tag: ' TAG
read -e -p 'Enter message: ' MESSAGE

git tag -a "v$TAG" -m "$MESSAGE"
git push --tags

npm publish