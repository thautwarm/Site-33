git branch -D gh-pages
git checkout -b gh-pages
op index.op --out . --force
git add -A
git commit -m "docs update"
git push origin gh-pages --force
git checkout main
