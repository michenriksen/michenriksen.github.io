---
title: "A new version of Gitrob is out"
layout: post
date: 2016-03-12 13:37
headerImage: false
category: blog
author: michenriksen
---

<span class="evidence">**Heads up! Gitrob has been totally rewritten in Go and is now much leaner and meaner. Read this blog post to get a general idea of the tool, and then read about the [new version](/blog/gitrob-now-in-go)!**</span>

It's been more than a year since I released the initial version of Gitrob. I haven't had a whole lot of time to expand on it, but now a new and improved version is finally here with a bunch of new features requested by users.

For those who don't know, Gitrob is a command line tool which can help organizations and security professionals find sensitive information lingering in publicly available files on GitHub. The tool will iterate over all public organization and member repositories and match filenames against a range of patterns for files that typically contain sensitive or dangerous information. Head over to [my previous post](/blog/gitrob-putting-the-open-source-in-osint/) for more details and screenshots, but be sure to come back here to learn about the new features!

The attention the tool has received has been way over my expectations and I want to thank everyone who has helped spread the word about it. With over 1100 Stars on GitHub, a place in [ThoughtWorks' Tech Radar](https://www.thoughtworks.com/radar/tools) and a mention in [The Hacker Playbook 2](http://www.amazon.com/The-Hacker-Playbook-Practical-Penetration/dp/1512214566), I will strive to maintain and build upon the tool more frequently from now on.

## New features

### Analyze arbitrary amount of organizations and users

The old version of Gitrob only allowed to analyze a single GitHub organization at a time, but the new version allows to mix any number of organizations and users in a single assessment. This is great if a company has multiple organizations or if you have identified GitHub users who work for the target company but don't have their membership publicly visible.

<div class="thumb-image">
  <a href="/assets/images/gitrob_1_0_0/analyze.png"><img src="/assets/images/gitrob_1_0_0/analyze_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Analyzing an organization and a user in one assessment.</figcaption>
</div>

### Create and delete assessments in web interface

The new version has an improved web application which allows users to run a new assessment directly from the web interface. This is very convenient if Gitrob runs on a server accessible to multiple users as they no longer require command line access to manage assessments.

<div class="thumb-image">
  <a href="/assets/images/gitrob_1_0_0/new_assessment.png"><img src="/assets/images/gitrob_1_0_0/new_assessment_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Creating a new assessments from the web interface.</figcaption>
</div>

### GitHub Enterprise support

The new version makes it possible to run Gitrob against custom GitHub Enterprise installations by simply providing the location when creating a new assessment. **Note:** I unfortunately don't have access to a GitHub Enterprise installation, so I would appreciate if anyone could verify if this works and report any bugs!

<div class="thumb-image">
  <a href="/assets/images/gitrob_1_0_0/new_assessment_enterprise.png"><img src="/assets/images/gitrob_1_0_0/new_assessment_enterprise_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Assessment against a custom GitHub Enterprise installation.</figcaption>
</div>

### Compare assessments for continuous monitoring

In the old version it wasn't really easy to continuously monitor an organization, but the new version makes it possible to compare two assessments to quickly identify new or modified files, users and repositories.

<div class="thumb-image">
  <a href="/assets/images/gitrob_1_0_0/comparison.gif"><img src="/assets/images/gitrob_1_0_0/comparison_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Comparing two assessments (Gif).</figcaption>
</div>

### Highlighting of interesting values and detection of test files

In the small improvements category, the new version detects and highlights interesting values such as IP addresses, domains, tokens and email addresses when viewing a file's content. The new version will also attempt to determine if a file is likely test or mock related and make them less visible so they can easily be skipped.

<div class="thumb-image">
  <a href="/assets/images/gitrob_1_0_0/highlighting.gif"><img src="/assets/images/gitrob_1_0_0/highlighting_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Highlighting of interesting values and dimming of test related files (Gif).</figcaption>
</div>

## Under the hood

Apart from the new features, Gitrob v1.0.0 is pretty much a complete rewrite of the first version and some components have been switched out with better and more stable components. Gitrob now uses [Sequel](https://rubygems.org/gems/sequel) for database communication, [github_api](https://rubygems.org/gems/github_api) for GitHub API interaction and [Thor](https://rubygems.org/gems/thor) for the command line interface. The switch to Thor also means that the interface is a little different from the old version: `gitrob -o acme` is now `gitrob analyze acme`.

## New file signatures

The new version also ships with a bunch of new signatures for files that might contain sensitive information:

* SSH configuration files (Might contain usernames and SSH hostnames)
* PostgreSQL password files (Contains PostgreSQL database credentials)
* [AWS CLI](https://aws.amazon.com/cli/) credential files (Contains Amazon Web Services credentials)
* [Day One](http://dayoneapp.com/) journal files (Might contain sensitive and personal information)
* [jrnl](https://maebert.github.io/jrnl/) journal files (Might contain sensitive and personal information)
* [Tugboat](https://github.com/pearkes/tugboat) configuration files (Might contain [DigitalOcean](https://www.digitalocean.com/) credentials)
* [git-credential-store](https://git-scm.com/docs/git-credential-store) configuration files (Contains Git credentials)
* Git configuration files (Contains names, email addresses and occasionally access tokens)
* [Chef](https://www.chef.io/chef/) Knife configuration files (Might contain references to Chef servers)
* [Chef](https://www.chef.io/chef/) private keys (Gives access to Chef servers)
* [cPanel](https://cpanel.com/) backup ProFTPd credential files (Might contain FTP server credentials)
* [Robomongo](https://robomongo.org/) configuration files (Might contain MongoDB database credentials)
* [FileZilla](https://filezilla-project.org/) configuration files (Might contain FTP server credentials)
* [FileZilla](https://filezilla-project.org/) recent servers files (Might contain FTP server credentials)
* [Ventrilo](http://www.ventrilo.com/) server configuration files (Might contain server credentials)
* [Docker](https://www.docker.com/) configuration files (Might contain credentials for public or private Docker registries)
* [NPM](https://www.npmjs.com/) configuration files (Might contain credentials for NPM registries)

Check out [signatures file](https://github.com/michenriksen/gitrob/blob/master/core/signatures.go#L163) for the full list of file signatures.

If you have a good idea for a new signature, please don't hesitate to make a Pull Request or simply create an Issue with details and I will look into it!

I am very excited about this release and I hope you are too. Hurry up and run Gitrob against your organization before someone else does! Installation and setup instructions can be found in the [README on GitHub](https://github.com/michenriksen/gitrob).

**Have fun and be responsible!**
