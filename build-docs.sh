git branch -D gh-pages
git checkout -b gh-pages
deno task build --location=https://thautwarm.github.io/Site-33/ --dest=docs
git add -A
git commit -m "docs update"
git push origin gh-pages --force
git checkout main
