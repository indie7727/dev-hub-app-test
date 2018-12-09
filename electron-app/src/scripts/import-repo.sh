#!/bin/bash

echo "Setting up your project."

echo "Creating directory ~/Desktop/dev-hub-repos"
cd ~/Desktop
mkdir -p dev-hub-repos

echo "Moving into ~/Desktop/dev-hub-repos"
cd dev-hub-repos

echo "Start cloning $1"
git clone "$1" 2>&1 | cat
echo "Cloning successful"

