---
title: "Gitrob: Now in Go"
date: 2018-06-09
aliases:
- "/blog/gitrob-now-in-go"
archive: true
---

I'm happy to announce that a new version of Gitrob has been released. This time it's a complete rewrite from Ruby to the amazing [Go programming language](https://golang.org/)!

The old Ruby version of Gitrob got messy and was neglected by me because I got tired of the code. I decided it was time for a rethink and rewrite of the project. As I had been planning to pick up Go as my next programming language I thought it would be interesting to make a lean and mean Go implementation. This turned out to be a pretty amazing decision!

## What's new

### Uncover interesting files in old commits

The new Gitrob drills deep into the commit history of a repository to surface files that might contain interesting or sensitive information. The default commit depth is 500 commits which strikes a good balance between speed and coverage, but it can of course be adjusted with a command line option. That old .bash_history file that was accidentally pushed and deleted 300 commits ago? Gitrob will find it.

### No more PostgreSQL database

There is no longer any need to install and set up a PostgreSQL server to use Gitrob. The new version simply serves up findings directly from memory, but can also be saved to special session files which can later be loaded again and shared with other people. The session files contain a simple JSON document which is also ideal for parsing and integration with other tools and systems.

### No more Ruby dependency hell

A big pain point for many users of the old Gitrob was trouble with dealing with Ruby and Ruby gems. Because the new version is written in Go, the whole tool is now a simple compiled binary that runs on Linux, Mac and Windows. No more fighting with RVM and native extensions that won't compile!

### New, sleek web UI

The web UI for browsing and analysing Gitrob findings is now faster, prettier and more robust with [Bootstrap](https://getbootstrap.com/) and [Backbone.js](http://backbonejs.org/).

### A mascot!

[Kent Gruber](https://twitter.com/KentGruber) was so generous to make me a Gopher mascot for Gitrob! The idea for a Gitrob Gopher was totally stolen from the [Bettercap](https://www.bettercap.org/), but I hope it will help me maintain the project. :)

### General simplification

A big reason why the old Gitrob got messy and bloated was because I tried to make the tool do too much. The purpose of the new Gitrob is to only find and present interesting files and nothing more. I hope that this will help keep the project more sane and healthy.

## Installation

Installing Gitrob is super easy. Simply head over to the project on Github and [download a pre-compiled binary](https://github.com/michenriksen/gitrob/releases) for your operating system. If you have Go set up, you can also get the latest version with *go get github.com/michenriksen/gitrob*.

Read more about installation and setup in the project [README](https://github.com/michenriksen/gitrob#installation).

## Thanks

Thanks to Simone '[evilsocket](https://twitter.com/evilsocket)' Margaritelli for his amazing, open source Go projects. I have learned a lot by looking at his code and a lot of Gitrob's code and structure is inspired by his projects.

I would also like to say thanks to [Kent Gruber](https://twitter.com/KentGruber) for being awesome and for spending time on making the Gitrob Gopher for me!

If you're interested in coding and security, you should follow both of these fine people on Twitter!

## Helping out

I hope you will try out the new version of Gitrob and that you will find it useful! Should you find any bugs or other weirdness, then please [open an issue](https://github.com/michenriksen/gitrob/issues/new) on Github! As this is my first real project in Go, I have likely committed several Go crimes in the code and feedback is appreciated, but please go easy on me! ;)
