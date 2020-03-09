---
title: "Gitrob: Putting the Open Source in OSINT"
layout: post
date: 2015-01-12 13:37
image: /assets/images/gitrob/gitrob_collecting_repos.png
headerImage: false
category: blog
author: michenriksen
---

<span class="evidence">**Heads up! Gitrob has been totally rewritten in Go and is now much leaner and meaner. Read this blog post to get a general idea of the tool, and then read about the [new version](/blog/gitrob-now-in-go)!**</span>

Developers generally like to share their code, and many of them do so by open sourcing it on GitHub, a social code hosting and collaboration service. Many companies also use GitHub as a convenient place to host both private and public code repositories by creating GitHub organizations where employees can be joined.

Sometimes employees might publish things that should not be publicly available. Things that contain sensitive information or things that could even lead to direct compromise of a system. This can happen by accident or because the employee does not know the sensitivity of the information.

[Gitrob](https://github.com/michenriksen/gitrob) is a command line tool that can help organizations and security professionals find such sensitive information. The tool will iterate over all public organization and member repositories and match filenames against a range of patterns for files that typically contain sensitive or dangerous information.

## How it works

Looking for sensitive information in GitHub repositories is not a new thing, it has been [known for a while](http://blog.conviso.com.br/2013/06/github-hacking-for-fun-and-sensitive.html) that things such as private keys and credentials can be found with GitHub's search functionality, however Gitrob makes it easier to focus the effort on a specific organization.

The first thing the tool does is to collect all public repositories of the organization itself. It then goes on to collect all the organization members and their public repositories, in order to compile a list of repositories that might be related or have relevance to the organization.

<div class="thumb-image">
  <a href="/assets/images/gitrob/gitrob_collecting_repos.png"><img src="/assets/images/gitrob/gitrob_collecting_repos_thumb.png" class="image" alt="" /></a>
  <figcaption class="caption">Gitrob collecting repositories from organization members.</figcaption>
</div>

When the list of repositories has been compiled, it proceeds to gather all the filenames in each repository and runs them through a series of observers that will flag the files, if they match any patterns of known sensitive files. This step might take a while if the organization is big or if the members have a lot of public repositories.

<div class="thumb-image">
  <a href="/assets/images/gitrob/gitrob_analyzing_repos.png"><img src="/assets/images/gitrob/gitrob_analyzing_repos_thumb.png" class="image" alt="" /></a>
  <figcaption class="caption">Gitrob sifting through collected repositories and flagging interesting files.</figcaption>
</div>

All of the members, repositories and files will be saved to a PostgreSQL database. When everything has been sifted through, it will start a [Sinatra](http://www.sinatrarb.com/) web server locally on the machine, which will serve a simple web application to present the collected data for analysis.

<div class="side-by-side">
  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/gitrob_findings.png"><img src="/assets/images/gitrob/gitrob_findings_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Interesting files across all repositories are shown in one list for easy analysis. The quick filter in the top right corner can be used to look for specific files.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/gitrob_findings_details.png"><img src="/assets/images/gitrob/gitrob_findings_details_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Clicking on a file will show its contents with syntax highlighting. It will also show why the file was flagged.</figcaption>
    </div>
  </div>

  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/gitrob_members.png"><img src="/assets/images/gitrob/gitrob_members_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Members of the organization can be viewed in a grid layout. Members with interesting files are easy to spot.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/gitrob_members_details.png"><img src="/assets/images/gitrob/gitrob_members_details_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Clicking on a member will show their basic information and public repositories. Repositories with findings are highlighted with an orange background.</figcaption>
    </div>
  </div>

  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/gitrob_repos.png"><img src="/assets/images/gitrob/gitrob_repos_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">All collected repositories can be viewed in a table with their descriptions and website URLs. Repositories with findings are highlighted with an orange background.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/gitrob_repo.png"><img src="/assets/images/gitrob/gitrob_repo_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">All files in a specific repository can be viewed. The quick filter in the top right corner can be used to look for specific files.</figcaption>
    </div>
  </div>
</div>

## Some findings

While developing Gitrob, I tested it against many different organizations belonging to various companies, big and small, both to expose the tool to a lot of real-life data and to notify the companies of any findings before release.

The tool found several interesting things ranging from low-level, to bad and all the way to company-destroying kind of information disclosure. Here's some examples...

**Note:** I have redacted sensitive and identifying information in the screenshots; I am not interested in embarrassing or exposing anyone. And again, all these findings have been reported.

<div class="side-by-side">
  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding1.png"><img src="/assets/images/gitrob/finding1_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Found in a .bash_profile file, the employee was thoughtful enough to mask the passwords, but still mapped out a big chunk of infrastructure with his command aliases. It also tells attackers that spear-phishing this employee will likely give them root access to a lot of databases.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding2.png"><img src="/assets/images/gitrob/finding2_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Found in a .bash_profile file, the command aliases revealed the existence of a secret black site domain used for the company's tools for everyday operations such as analytics, metrics and continuous integration. A big increase in attack surface.</figcaption>
    </div>
  </div>

  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding3.png"><img src="/assets/images/gitrob/finding3_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Command history files can contain a lot of sensitive information, such as passwords, API keys and hostnames.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding4.png"><img src="/assets/images/gitrob/finding4_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">A developer had open sourced a Wordpress website, including a complete database dump with password hash for his user account. Maybe the same password is used somewhere else?</figcaption>
    </div>
  </div>

  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding5.png"><img src="/assets/images/gitrob/finding5_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">An .env file for a chat bot contained several credentials. Apart from an attacker being able to spy on their Campfire chat and steal stuff from the data stores, they would also be able to control the temperature somewhere with the Nest credentials.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding6.png"><img src="/assets/images/gitrob/finding6_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">A company had open sourced their documentation website, a simple Ruby On Rails application. They forgot to remove the application secret token, which can be <a href="https://www.rapid7.com/db/modules/exploit/multi/http/rails_secret_deserialization" rel="nofollow">exploited</a> to achieve remote code execution.</figcaption>
    </div>
  </div>

  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding7.png"><img src="/assets/images/gitrob/finding7_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">A developer had checked in his KeePass password database containing 174 entries. The data is heavily encrypted, but the master password can be <a href="https://github.com/darkk/keebrute" rel="nofollow">brute-forced</a>. In this case the company was certainly interesting enough for someone to throw a lot of computing power at that task.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding8.png"><img src="/assets/images/gitrob/finding8_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">Amazon EC2 credentials found in a .zshrc file. depending on the level of privilege, it can potentially give complete control of the company's infrastructure.</figcaption>
    </div>
  </div>

  <div class="toleft">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding9.png"><img src="/assets/images/gitrob/finding9_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">An employee had checked in an Amazon EC2 private key which can potentially give complete control of the company's infrastructure.</figcaption>
    </div>
  </div>

  <div class="toright">
    <div class="thumb-image">
      <a href="/assets/images/gitrob/finding10.png"><img src="/assets/images/gitrob/finding10_thumb.png" class="image" alt="" /></a>
      <figcaption class="caption">The same employee from the last screenshot also checked in his private SSH key, which could potentially grant access to the company's SSH servers. It could potentially also be used to clone private organization repositories.</figcaption>
    </div>
  </div>
</div>

## Why I created Gitrob

I work in the security team at SoundCloud and one of my recent tasks has been to create a system that continuously watches our GitHub organization for various things that might be a security risk, including looking for potential sensitive files in repositories. During development, I thought it would be interesting to take parts of this system and open sourcing it as a tool that can be used both defensively and offensively.

If you are responsible for security at a company that uses GitHub for hosting code, Gitrob can be used to periodically check your organization for any sensitive files that might be lingering in repositories.

If you are on the offensive side, like a professional penetration tester, Gitrob can be used in the initial information gathering stage to look for anything that might give you a foothold or increase the target's attack surface. Gitrob can also give you usernames, names, email addresses and names of internal systems that are useful in phishing campaigns and social engineering attacks. If you are lucky, Gitrob can even give you complete pwnage without ever sending a single malicious packet to the target's systems.

**Have fun and be responsible!**
