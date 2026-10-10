#!/bin/bash
set -e
cd "$(dirname "$0")"
node browsertest-installatie.js
node controleer-alles-v205.js
