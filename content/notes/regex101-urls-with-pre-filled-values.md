---
title: regex101 URLs with pre-filled values
date: 2024-11-05
categories: [regex, web-tools]
---

It's possible to link to [regex101](https://regex101.com/) with pre-filled regular expression, flags, and test string,
as well as pre-selected flavor/engine with these undocumented URL parameters:

```

https://regex101.com/?regex=...&testString=...&flags=...&flavor=...

```

[**Example link**](<https://regex101.com/?regex=p%28%5Ba%2Dz%5D%2B%29ch&testString=peach%20punch%20pinch&flavor=golang>)

The `flavor` value can be one of the following:

- `pcre2` for PCRE2 (PHP >=7.3)
- `pcre` for PCRE (PHP <7.3)
- `javascript` for ECMAScript (JavaScript)
- `python` for Python
- `golang` for Golang
- `java` for Java 8
- `dotnet` for .NET 7.0 (C#)
- `rust` for Rust

While regex101 has a nice feature for saving and sharing, these parameters are convenient for programmatically
creating playground links.
