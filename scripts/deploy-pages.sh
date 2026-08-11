#!/bin/bash
# Build the app + Storybook for GitHub Pages and push to the public demo repo.
# Usage: bash scripts/deploy-pages.sh
set -euo pipefail

BASE="/finout-workshop-demo"
DEMO_REPO="danielboaron23/finout-workshop-demo"
WORK=$(mktemp -d)

echo "== 1/5 building Next static export"
PAGES_BASE=$BASE npx next build

echo "== 2/5 building Storybook"
npx storybook build

echo "== 3/5 post-processing asset paths"
# prefix absolute /icons|/images|/brand references with the Pages base
for d in icons images brand; do
  find out \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.txt' \) -exec perl -pi -e "s|([\"'\`(])/$d/|\${1}$BASE/$d/|g" {} +
  find storybook-static \( -name '*.html' -o -name '*.js' -o -name '*.css' \) -exec perl -pi -e "s|([\"'\`(])/$d/|\${1}$BASE/storybook/$d/|g" {} +
done

echo "== 4/5 assembling site"
cp -R out/. "$WORK"/
mkdir -p "$WORK/storybook"
cp -R storybook-static/. "$WORK/storybook"/
touch "$WORK/.nojekyll"

echo "== 5/5 pushing to $DEMO_REPO"
cd "$WORK"
git init -q -b main
git add -A
git commit -q -m "Deploy finout-workshop demo (app + storybook)"
git push -q -f "https://github.com/$DEMO_REPO.git" main
echo "done: https://danielboaron23.github.io$BASE/"
