---
title: "{{ replace .File.ContentBaseName `-` ` ` | title }}"
date: "{{ time.Now | time.Format `2006-01-02` }}"
aliases:
- "/blog/{{ .File.BaseFileName }}"
archive: true
---
