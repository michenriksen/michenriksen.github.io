---
title: "AQUATONE: A tool for domain flyovers"
layout: post
date: 2017-06-17 13:37
image: /assets/images/aquatone/u2.jpg
headerImage: false
category: blog
author: michenriksen
---

<div class="thumb-image">
  <a href="/assets/images/aquatone/u2.jpg"><img src="/assets/images/aquatone/u2.jpg" class="image" alt="" /></a>
  <figcaption class="caption">The Lockheed U-2 reconnaissance aircraft was given the codename Aquatone.</figcaption>
</div>

<span class="evidence">**Heads up! Aquatone has been totally rewritten in Go and is now quite a bit different. Read about the [new version](/blog/aquatone-now-in-go)!**</span>

Knowing the attack surface of something is critical for both defending and attacking it. When it comes to domain names, a very common approach for uncovering the attack surface is to discover its subdomains. Subdomains will increase the number of potential target sites as well as uncover IP ranges to probe further.

There are plenty of tools already for subdomain enumeration, e.g. [Fierce](http://tools.kali.org/information-gathering/fierce), [SubBrute](https://github.com/TheRook/subbrute) and [Gobuster](https://github.com/OJ/gobuster) however [AQUATONE](https://github.com/michenriksen/aquatone) takes things a step further by not only doing classic brute force enumeration but also utilizing various open sources and internet services to dramatically increase the number of discovered subdomains. When subdomains have been discovered, AQUATONE can then be used to probe the hosts for common HTTP ports and gather response headers, HTML and screenshots to be compiled into a nice report for easy analysis.

To make the tool as flexible as possible, AQUATONE is divided into three separate commands, so if you're only interested in using it for subdomain discovery without any scanning or screenshotting, you can easily do that. Lets go over the three phases of an AQUATONE assessment:

## Phase 1: Discovery

To demonstrate the usage of AQUATONE, we will perform an assessment on the `corp.yahoo.com` domain. I have chosen this domain because Yahoo's [Bug Bounty program](https://hackerone.com/yahoo) includes all of `*.yahoo.com` in their scope, so it should be acceptable to run a tool like AQUATONE against it.

Kicking off the `aquatone-discover` tool:

<div class="thumb-image">
  <a href="/assets/images/aquatone/discover_start.png"><img src="/assets/images/aquatone/discover_start_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Starting aquatone-discover against `corp.yahoo.com`...</figcaption>
</div>

The first thing `aquatone-discover` does is to identify the authoritative name servers for the target domain. Using these name servers for resolution ensures that the information is up to date and discovery is maximised.

It also does a quick test to see if the target domain is configured to be a wildcard domain as such domains can produce a lot of false positives. If the domain turns out to be a wildcard, it will identify the possible wildcard responses and filter them out. `corp.yahoo.com` is luckily not configured to be wildcard.

After name server and wildcard detection, it proceeds to ask each subdomain collector module for potential subdomains under the target domain. `aquatone-discover` ships with following collector modules:

* Dictionary brute force
* [DNSDB.org](http://dnsdb.org/)
* [Google Transparency Report](https://www.google.com/transparencyreport/)
* [HackerTarget](https://hackertarget.com/find-dns-host-records/)
* [Netcraft](http://searchdns.netcraft.com/)
* [Shodan](https://www.shodan.io/) (requires API key)
* [ThreatCrowd](https://www.threatcrowd.org/)
* [VirusTotal](http://www.virustotal.com/) (requires API key)

The collector modules returned a total of 12.282 potential subdomains that aquatone-discover attempts to resolve.

<div class="thumb-image">
  <a href="/assets/images/aquatone/discover_progress.png"><img src="/assets/images/aquatone/discover_progress_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">aquatone-discover resolving subdomains. Hitting Enter will output a progress report.</figcaption>
</div>

After a while, aquatone-discover has run through the list and uncovered a total of 1.958 live subdomains. It also analyzed the IPs and printed a list of potential IP subnet ranges which can be used for further probing:

<div class="thumb-image">
  <a href="/assets/images/aquatone/discover_finished.png"><img src="/assets/images/aquatone/discover_finished_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">aquatone-discover uncovered a total of 1.958 live subdomains.</figcaption>
</div>

It also wrote the discovered hosts to files in the aquatone assessment directory that is automatically created for the target domain. `hosts.txt` contains a comma-separated list of domains and their IP:

```
224-si1.corp.yahoo.com,207.126.224.4
224-si2.corp.yahoo.com,207.126.224.5
227-si1.corp.yahoo.com,207.126.227.4
227-si2.corp.yahoo.com,207.126.227.7
232-si1.corp.yahoo.com,207.126.232.4
232-si2.corp.yahoo.com,207.126.232.5
351-si1.corp.yahoo.com,216.145.51.4
351-si2.corp.yahoo.com,216.145.51.96
998-dmz-foundry1.corp.yahoo.com,216.145.48.25
998-dmz-foundry2.corp.yahoo.com,216.145.48.39
aa-dc1.wpe.stg.test.corp.yahoo.com,98.137.139.80
aa-dc2.wpe.stg.test.corp.yahoo.com,98.137.139.81
aaa1-1-a-gci.corp.yahoo.com,216.145.50.84
aaa1-2-a-gci.corp.yahoo.com,216.145.50.87
aahost1.stg.test.corp.yahoo.com,98.137.139.82
aahost2.stg.test.corp.yahoo.com,98.137.139.83
aahost3.stg.test.corp.yahoo.com,98.137.139.84
aahost4.stg.test.corp.yahoo.com,98.137.139.85
aape01.stg.test.corp.yahoo.com,98.137.139.93
aavm1.stg.test.corp.yahoo.com,98.137.139.87
...
```

This file can be sliced and diced with common command line tools and loaded into other tools that you might use. `hosts.json` contains the same information in JSON format and is used by the other AQUATONE tools but can also be useful if you want to use the information with custom scripts.

## Phase 2: Scanning

Having discovered a bunch of subdomains on `corp.yahoo.com` is already quite useful. We could stop here and start poking around with other tools or manual browsing, but lets instead make `aquatone-scan` do the hard work for us of finding which hosts might serve web content:

<div class="thumb-image">
  <a href="/assets/images/aquatone/scan.png"><img src="/assets/images/aquatone/scan_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">aquatone-scan finding open ports on hosts.</figcaption>
</div>

aquatone-scan found a bunch of open HTTP ports across the different hosts. By default, it will scan the following TCP ports: 80, 443, 8000, 8080 and 8443 which are all very common ports for web services. You can of course change this to your own list of ports with the `--ports` option, or specify one of the built-in list aliases:

* `small`: 80, 443
* `medium`: 80, 443, 8000, 8080, 8443 (same as default)
* `large`: 80, 81, 443, 591, 2082, 2087, 2095, 2096, 3000, 8000, 8001, 8008, 8080, 8083, 8443, 8834, 8888
* `huge`: 80, 81, 300, 443, 591, 593, 832, 981, 1010, 1311, 2082, 2087, 2095, 2096, 2480, 3000, 3128, 3333, 4243, 4567, 4711, 4712, 4993, 5000, 5104, 5108, 5800, 6543, 7000, 7396, 7474, 8000, 8001, 8008, 8014, 8042, 8069, 8080, 8081, 8088, 8090, 8091, 8118, 8123, 8172, 8222, 8243, 8280, 8281, 8333, 8443, 8500, 8834, 8880, 8888, 8983, 9000, 9043, 9060, 9080, 9090, 9091, 9200, 9443, 9800, 9981, 12443, 16080, 18091, 18092, 20720, 28017

Using a larger port list will of course let you discover more web services, but it will also increase the time it takes for aquatone-scan to finish.

aquatone-scan created two new files in the assessment directory for `corp.yahoo.com`: `open_ports.txt` is a simple comma-separated list of hosts and their open ports:

```
117.104.189.54,443
124.108.98.253,443
124.108.98.254,443
203.83.249.10,443
203.83.249.4,443
203.83.249.5,443
203.83.249.8,443
203.83.249.9,443
209.131.62.228,443
209.131.62.229,443
209.131.62.230,443
209.131.62.231,443
216.145.48.148,443
216.145.48.149,443
216.145.48.150,443
216.145.48.151,443
216.145.48.152,443
216.145.48.153,443
72.30.2.113,443,80
77.238.184.150,80
98.136.163.125,80,443
98.136.205.152,443,80
98.136.205.216,443
```

`urls.txt` contains a list of URLs that can be used to request the web pages on the open ports:

```
http://bomgar.corp.yahoo.com/
http://bouncer.gh.corp.yahoo.com/
http://buzz.corp.yahoo.com/
http://cloud.corp.yahoo.com/
http://fifa.corp.yahoo.com/
http://gemini.corp.yahoo.com/
http://guest.corp.yahoo.com/
http://insights.corp.yahoo.com/
http://ipv6.corp.yahoo.com/
http://marketingcentral.corp.yahoo.com/
http://messenger.corp.yahoo.com/
http://request.corp.yahoo.com/
http://sas.corp.yahoo.com/
http://services.corp.yahoo.com/
http://shop.corp.yahoo.com/
http://si.corp.yahoo.com/
http://wireless.corp.yahoo.com/
https://bomgar.corp.yahoo.com/
https://bouncer.gh.corp.yahoo.com/
https://fast.corp.yahoo.com/
...
```

These files are used for the next phase of the assessment but are also convenient for loading into other tools like [EyeWitness](https://github.com/ChrisTruncer/EyeWitness) or slicing and dicing with `grep`, `cut`, `awk`, etc.

## Phase 3: Gathering

We now know about subdomains and open ports on `*.corp.yahoo.com`, it's time to use `aquatone-gather` to collect HTTP responses and screenshots and compile it all into a nice report:

<div class="thumb-image">
  <a href="/assets/images/aquatone/gather_start.png"><img src="/assets/images/aquatone/gather_start_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">aquatone-gather crunching through the web pages.</figcaption>
</div>

aquatone-gather loaded data from the files created by the previous AQUATONE tools and started requesting URLs to collect HTTP responses and screenshots. Behind the scenes, it uses [Nightmare](https://github.com/segmentio/nightmare) for all the heavy lifting of requesting and screenshotting.

Unfortunately Nightmare, and any other browser automation tool, is a bit flaky and will fail on some of the page processings as can be seen in the screenshot. I think the failure rate is acceptable, but something to be aware of.

After a little while, it finishes processing all the web pages:

<div class="thumb-image">
  <a href="/assets/images/aquatone/gather_finish.png"><img src="/assets/images/aquatone/gather_finish_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">aquatone-gather finished processing web pages.</figcaption>
</div>

It prints a short summary of successful vs. failed page processings and a list of generated report pages, but this is far from the only files that aquatone-gather generated. Navigating to the assessment folder, we can see three new folders: `headers`, `html`, `report` and `screenshots`.

The `headers` folder contains text files with response headers from all the page visits:

```
root@kali:~/aquatone/corp.yahoo.com/headers# cat bomgar_corp_yahoo_com__98_136_205_152__443.txt
Cache-Control: no-cache
Connection: Keep-Alive
Content-Type: text/html; charset=utf-8
Date: Wed, 14 Jun 2017 12:22:01 GMT
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Keep-Alive: timeout=15, max=100
Pragma: no-cache
Server: Bomgar
Set-Cookie: ns_s=c9b9309296cf5babeb7e193125cb2cf0f3c7f13c; path=/; secure; HttpOnly
Strict-Transport-Security: max-age=31536000
Transfer-Encoding: chunked
X-Ua-Compatible: IE=edge
root@kali:~/aquatone/corp.yahoo.com/headers#
```

These files can be very useful with `grep` and other tools to quickly find information on server technology and other things that are interesting from a security point of view.

The `html` folder contains HTML bodies from all the page visits:

```
root@kali:~/aquatone/corp.yahoo.com/html# cat bomgar_corp_yahoo_com__98_136_205_152__443.html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Yahoo! Global Service Desk LiveChat</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link href="/content/common.css" rel="stylesheet" type="text/css" />
<link href="/content/public.css" rel="stylesheet" type="text/css" />
<link href="/content/mobile.css" rel="stylesheet" type="text/css" />

</head>
<body>
<div id="container">

<div id="header" class="contentBox">
...
<div style="display: none">
<div style="margin: 1em;">
	<a href="http://www.bomgar.com" class="inverse" target="_blank">Secure Remote Desktop Access by Bomgar</a>

</div>
</div>

</div>

</body>
</html>
root@kali:~/aquatone/corp.yahoo.com/html#
```

There are tons of things that these files can be used for. More on this later.

The `screenshots` folder contains, as the name might suggest, PNG screenshots of all the page visits:

```
root@kali:~/aquatone/corp.yahoo.com/screenshots# ls
bomgar_corp_yahoo_com__98_136_205_152__443.png
bomgar_corp_yahoo_com__98_136_205_152__80.png
bouncer_gh_corp_yahoo_com__72_30_2_113__443.png
bouncer_gh_corp_yahoo_com__72_30_2_113__80.png
buzz_corp_yahoo_com__77_238_184_150__80.png
cloud_corp_yahoo_com__77_238_184_150__80.png
...
si_corp_yahoo_com__77_238_184_150__80.png
vpn1-1-gci_eglbp_corp_yahoo_com__203_83_249_4__443.png
vpn1-1-ptn_corp_yahoo_com__216_145_48_151__443.png
vpn1-1-ptn_eglbp_corp_yahoo_com__203_83_249_10__443.png
vpn1-2-gci_sv6_corp_yahoo_com__209_131_62_228__443.png
vpn-1-gci_hongkong_corp_yahoo_com__117_104_189_54__443.png
vpn2-1-gci_eglbp_corp_yahoo_com__203_83_249_5__443.png
vpn2-1-ptn_corp_yahoo_com__216_145_48_152__443.png
vpn2-2-gci_sv6_corp_yahoo_com__209_131_62_229__443.png
vpn-2-gci_sv6_corp_yahoo_com__209_131_62_230__443.png
wireless_corp_yahoo_com__77_238_184_150__80.png
root@kali:~/aquatone/corp.yahoo.com/screenshots#
```

You can of course browse these screenshots directly in the folder, but it's probably more useful to analyse them by opening the generated HTML report page:

<div class="thumb-image">
  <a href="/assets/images/aquatone/aquatone_report.gif"><img src="/assets/images/aquatone/aquatone_report_thumbnail.png" class="image" alt="" /></a>
  <figcaption class="caption">Browsing the AQUATONE report (Gif).</figcaption>
</div>

The report lines up the screenshots with response headers so that you quickly scan through the collected information for interesting pages. AQUATONE will highlight headers that may increase security with a green background and headers that may present a security issue with a red background. Before you go on a bug bounty spree with this, please remember that god strangles a puppy every time someone reports missing `X-Frame-Options`. ;)

## CLI tricks

The generated report is the final product of AQUATONE, but lots of useful stuff can be done with all the raw files that are generated in the assessment folder, so let's wrap up this blog post with some examples of what you can do:

### Get server technology stats

```
root@kali:~/aquatone/corp.yahoo.com/headers# cat * | grep 'Server:' | sort | uniq -c | sort -nr
     13 Server: ATS
      6 Server: Bomgar
      1 Server: AkamaiGHost
root@kali:~/aquatone/corp.yahoo.com/headers#
```

### Find more subdomains

```
root@kali:~/aquatone/corp.yahoo.com/html# cat * | egrep -o '[a-z0-9\-\_\.]+\.corp\.yahoo\.com' | sort -u
bomgar.corp.yahoo.com
bouncer.by.corp.yahoo.com
fast.corp.yahoo.com
it.corp.yahoo.com
request.corp.yahoo.com
services.corp.yahoo.com
root@kali:~/aquatone/corp.yahoo.com/html#
```

### Find HTML comments

```
root@kali:~/aquatone/corp.yahoo.com/html# cat * | egrep -o '<!--.*-->'
<!--//-->
<!-- Begin comScore Tag -->
<!-- bouncer02.gh.bf1.yahoo.com Wed Jun 14 12:22:09 UTC 2017 -->
<!-- bouncer12-os.gh.bf2.yahoo.com Wed Jun 14 12:22:29 UTC 2017 -->
<!-- #doc4 -->
<!-- .dw1 -->
<!-- .dw4 -->
...
<!-- /.shmod -->
<!-- SpaceID=0 timeout (ads1) -->
<!-- src2.ops.ir2.yahoo.com Wed Jun 14 12:22:15 UTC 2017 -->
<!-- src4.ops.ir2.yahoo.com Wed Jun 14 12:21:44 UTC 2017 -->
<!-- src4.ops.ir2.yahoo.com Wed Jun 14 12:21:51 UTC 2017 -->
<!-- src4.ops.ir2.yahoo.com Wed Jun 14 12:22:27 UTC 2017 -->
<!-- src6.ops.ir2.yahoo.com Wed Jun 14 12:21:57 UTC 2017 -->
<!-- src6.ops.ir2.yahoo.com Wed Jun 14 12:22:15 UTC 2017 -->
<!-- src6.ops.ir2.yahoo.com Wed Jun 14 12:22:36 UTC 2017 -->
<!-- URL: /::ProfilerTotal:557:1497442917838::Page Creation:40:1497442917838::user_ups:0:1497442917844::ydht_time:1:1497442917845::Maple Execution:518:1497442917878::Maple WS:41:1497442917879::SHAdModule:457:1497442917921::SHLeftNavigationModule:7:1497442918378::SHHeroModule:0:1497442918385::SHBrowseShoppingModule:5:1497442918385::SHSocialNewBrowseModule:0:1497442918390::SHCopyrightModule:1:1497442918391:: -->
<!-- web23.shop.bf1.yahoo.com -->
<!-- web23.shop.bf1.yahoo.com Wed Jun 14 12:21:57 UTC 2017 -->
```

### Find pages with password fields

```
root@kali:~/aquatone/corp.yahoo.com/html# grep 'type="password"' *
bouncer_gh_corp_yahoo_com__72_30_2_113__80.html: <dd><input class="input-large" name="pass_word" type="password" id="pass_word" maxlength="64"   autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ></dd>
fast_corp_yahoo_com__98_136_205_216__443.html: <dd><input class="input-large" name="pass_word" type="password" id="pass_word" maxlength="64"   autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ></dd>
root@kali:~/aquatone/corp.yahoo.com/html#
```

### Get hosts listening on port 443

```
root@kali:~/aquatone/corp.yahoo.com# cat open_ports.txt | grep ',443' | cut -d "," -f 1
117.104.189.54
124.108.98.253
124.108.98.254
203.83.249.10
203.83.249.4
...
216.145.48.153
72.30.2.113
98.136.163.125
98.136.205.152
98.136.205.216
root@kali:~/aquatone/corp.yahoo.com#
```

### Check HTTPS hosts for Heartbleed

```
root@kali:~/aquatone/corp.yahoo.com# grep https urls.txt | cut -d '/' -f 3 > /tmp/targets.lst
root@kali:~/aquatone/corp.yahoo.com# sslscan --targets=/tmp/targets.lst --no-ciphersuites --no-fallback --no-renegotiation --no-compression --no-check-certificate
Version: 1.11.9-static
OpenSSL 1.0.2l-dev  xx XXX xxxx

Testing SSL server bomgar.corp.yahoo.com on port 443 using SNI name

  Heartbleed:
TLS 1.2 not vulnerable to heartbleed
TLS 1.1 not vulnerable to heartbleed
TLS 1.0 not vulnerable to heartbleed



Testing SSL server bouncer.gh.corp.yahoo.com on port 443 using SNI name
...
Testing SSL server vpn2-2-gci.sv6.corp.yahoo.com on port 443 using SNI name

  Heartbleed:
TLS 1.2 not vulnerable to heartbleed
TLS 1.1 not vulnerable to heartbleed
TLS 1.0 not vulnerable to heartbleed

root@kali:~/aquatone/corp.yahoo.com#
```

That's it! I hope you will take AQUATONE on a test flight and let me know what you think. You can find installation instructions in the project [README](https://github.com/michenriksen/aquatone#installation).
