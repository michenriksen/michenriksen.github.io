---
title: "Subdomain takeover detection with AQUATONE"
layout: post
date: 2017-07-21 13:37
headerImage: false
category: blog
author: michenriksen
---

<span class="evidence">**Heads up! Aquatone has been totally rewritten in Go and is now quite a bit different. Read about the [new version](/blog/aquatone-now-in-go)!**</span>

Hostile subdomain takeover is a very prevalent and potentially critical security issue. It's a well-known attack vector and easy to exploit, and should therefore be taken seriously.

A subdomain takeover vulnerability typically happens when an organization assigns a subdomain to an external service, e.g. a support ticketing system like [Zendesk](https://zendesk.com/), a cloud application platform like [Heroku](https://www.heroku.com/) or maybe a content delivery network like [Fastly](https://www.fastly.com/). Maybe the organization is only assessing the service, or maybe they switch to a different service, but for some reason the organization later decides to delete their account on the service, but forget one important step: to remove the subdomain DNS configuration to the service.

Having a dangling subdomain pointing to an unused external service leaves it open for takeover and complete control of an attacker, as they simply need to sign up to the same service and claim the dangling subdomain. Now they control the content on the subdomain which they can use to launch phishing attacks, bypass security controls and other mischief.

[Detectify](https://detectify.com/) wrote a [blog post](https://labs.detectify.com/2014/10/21/hostile-subdomain-takeover-using-herokugithubdesk-more/) about subdomain takeover back in 2014, if you're interested in knowing more about this attack vector.

## Detecting subdomain takeovers with AQUATONE

In case you don't know, I recently released [AQUATONE](/blog/aquatone-tool-for-domain-flyovers/) which is a toolset for doing subdomain discovery, port scanning and screenshotting. Check out the [blog post](/blog/aquatone-tool-for-domain-flyovers/) for more information.

A new addition to the AQUATONE toolset is `aquatone-takeover` which can detect potential subdomain takeover issues across a bunch of popular external services:

<div class="thumb-image">
  <a href="/assets/images/aquatone/takeover.png"><img src="/assets/images/aquatone/takeover_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Finding subdomains vulnerable to hostile takeover.</figcaption>
</div>

To demonstrate the functionality of aquatone-takeover, I temporarily configured a couple of subdomains on `michenriksen.com` pointed at 3 different external services. aquatone-takeover detects all three as potentially vulnerable:

* `assets.michenriksen.com` is a `CNAME` record pointing to an unclaimed [Amazon S3](https://aws.amazon.com/s3/) bucket.
* `store.michenriksen.com` is a `CNAME` record pointing to [Shopify](https://www.shopify.com/), a popular ecommerce platform, and the subdomain has not been registered with any account.
* Finally, `help.michenriksen.com` is a `CNAME` record pointing at a non-existant account on [Desk](https://www.desk.com/), a popular support ticketing system.

These are not the only external services that aquatone-takeover can detect, it finds subdomain takeover vulnerabilities across - at the time of writing - a total of 25 services:


* [Amazon S3](https://aws.amazon.com/s3/) (Cloud storage)
* [Campaign Monitor](https://www.zendesk.com/) (Email marketing)
* [Cargo](https://cargocollective.com/) (Web publishing platform)
* [Cloudfront](https://aws.amazon.com/cloudfront/) (Content delivery network)
* [Desk](https://www.desk.com/) (Customer service and helpdesk ticket software)
* [Fastly](https://www.fastly.com/) (Content delivery network)
* [FeedPress](https://feed.press/) (Feed analytics and Podcast hosting)
* [Freshdesk](https://freshdesk.com/) (Customer support software and ticketing system)
* [Ghost](https://ghost.org/) (Publishing platform)
* [GitHub Pages](https://pages.github.com/) (GitHub static website hosting)
* [Help Scout](https://www.helpscout.net/) (Customer service software and education platform)
* [Helpjuice](https://helpjuice.com/) (Knowledge base software)
* [Heroku](https://www.heroku.com/) (Cloud application platform)
* [Instapage](https://instapage.com/) (Landing page platform)
* [Pingdom](https://www.pingdom.com/) (Website and performance monitoring)
* [Shopify](https://www.shopify.com/) (Ecommerce platform)
* [StatusPage](https://www.statuspage.io/) (Status page hosting)
* [SurveyGizmo](https://www.surveygizmo.com/) (Online survey software)
* [Teamwork](https://www.teamwork.com/) (Project management, help desk and chat software)
* [Tictail](https://tictail.com/) (Social shopping platform)
* [Tumblr](https://www.tumblr.com/) (Microblogging and social networking platform)
* [Unbounce](https://unbounce.com/) (Landing page builder and conversion marketing platform)
* [UserVoice](https://www.uservoice.com/) (Product management software)
* [WPEngine](https://wpengine.com/) (WordPress blog hosting)
* [Zendesk](https://www.zendesk.com/) (Customer service software and support ticket system)

I hope to expand this list with many more services, so please let me know if you have any ideas or go ahead and contribute more detector modules on [GitHub](https://github.com/michenriksen/aquatone).

Give aquatone-takeover a try! You can install the AQUATONE toolset with `gem install aquatone` or get the latest version with `gem update aquatone` if you already have it installed.

Here's a small list of articles and reports on subdomain takeover issues across the web:


* [Hacker defaces Donald Trump fundraising site via subdomain takeover attack](https://www.grahamcluley.com/hacker-defaces-donald-trump-fundraising-site-via-subdomain-takeover-attack/)
* [Subdomain takeover of blog.snapchat.com](https://hackernoon.com/subdomain-takeover-of-blog-snapchat-com-60860de02fe7)
* [Subdomain takeover on s3.shopify.com](https://hackerone.com/reports/207576)
* [Subdomain takeover on happymondays.starbucks.com due to non-used AWS S3 DNS record](https://hackerone.com/reports/186766)
* [Authentication bypass on Uber’s Single Sign-On via subdomain takeover](https://www.arneswinnen.net/2017/06/authentication-bypass-on-ubers-sso-via-subdomain-takeover/)

**Happy hunting!**
