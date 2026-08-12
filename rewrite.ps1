$ErrorActionPreference = "Stop"

git checkout -b temp_rewrite HEAD~5

$commits = @(
  @{hash="841aa49"; msg="fix: update URLs to use resolution numbers, fix parseSection regex, and use english month names"},
  @{hash="1ea509f"; msg="feat: add loading.tsx skeleton for ordinance pages"},
  @{hash="fb8377d"; msg="fix: complete Section 4 and add Section 6 to ordinance 681-2024"},
  @{hash="8d728fb"; msg="fix: update database data for 681-2024 and 310-2024 and fix parser logic"},
  @{hash="efdf5ea"; msg="chore: update seed data with realistic section titles and penalties"}
)

foreach ($c in $commits) {
    git cherry-pick $c.hash
    git commit --amend -m $c.msg
}

git checkout main
git reset --hard temp_rewrite
git branch -D temp_rewrite
git push origin main --force
