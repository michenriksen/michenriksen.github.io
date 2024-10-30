---
title: Private Go modules in GitLab CI/CD
date: 2024-10-30
categories: [Golang, Gitlab, 'CICD']
---

This took way too long for me to figure out, so here's how to install private Go modules in [GitLab CI/CD] pipeline
jobs:

## netrc and GOPRIVATE

Add the following to the jobs that require installing dependencies and replace `<namespace>` with your organization or
username which hosts the private Go modules:

```yaml
before_script:
    - echo -e "machine gitlab.com login gitlab-ci-token password ${CI_JOB_TOKEN}" > ~/.netrc
    - go env -w GOPRIVATE="gitlab.com/<namespace>"
```

The special [.netrc] file will be used by `go get`/`go mod tidy` to fetch the private modules by authenticating with
the username `gitlab-ci-token` and the special [CI_JOB_TOKEN].

There are a few guides and forum replies out there that mention using `git config` and `.insteadOf` to rewrite how
go fetches dependencies, however, did this not work for me.

## Permitting job token access

Using the job token to fetch the private modules will not work out of the box. It's necessary to allowlist job tokens
from the main project in each project hosting the private Go modules:

1. For each project, go to **Settings** -> **CI/CD**.
2. Expand **Job token permissions**.
3. Click on the **Add group or project** button.
4. Select the main project and click on the **Add** button.

[GitLab CI/CD]: https://docs.gitlab.com/ee/ci/
[CI_JOB_TOKEN]: https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html
[.netrc]: https://www.gnu.org/software/inetutils/manual/html_node/The-_002enetrc-file.html
