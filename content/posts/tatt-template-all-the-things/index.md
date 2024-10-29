---
title: "Templating all the things"
date: "2024-05-22"
locale: "en_US"
categories: ["golang", "tool", "open-source"]
---

I created and released a simple CLI tool to render Go templates using data from YAML, JSON, or TOML files.
{.lead}
<!--more-->

Lately, I've frequently used [Go's text/template](https://pkg.go.dev/text/template) package for small, one-off tasks
where I needed to generate specific data formats from simple data.

Go's templating system offers a robust way to generate textual output, but it always requires some glue code to parse
the templates and render them with dynamic data.

To simplify this process, I created a command-line tool called {{< sidenote "tatt." >}}Acronym for Template All The Things.{{< /sidenote >}} With tatt, you only need to write the template and provide the data in a parsable format. It's available as open-source under the MIT license at [https://github.com/michenriksen/tatt](https://github.com/michenriksen/tatt).

## Usage example: Generating Semgrep rules

To demonstrate how to use **tatt**, I'll share a recent real-world task I solved with it. I needed to create a
collection of [Semgrep](https://semgrep.dev/) rules to detect the usage of clients from the [JavaScript AWS SDK](https://github.com/aws/aws-sdk-js).

The SDK has a large number of clients, and Semgrep rules are defined in YAML, making this a perfect task for tatt.

### Step 1: Defining the template

First thing is to define a template that loops over a list of objects containing client information to create a Semgrep
rule for each client in the SDK:

```go-template {linenos=true}
---
rules:
  {{- range .Clients }}
  - id: AWS{{.Client}}
    patterns:
      - pattern-either:
          - pattern-inside: |
              $IMPORT = require('aws-sdk')
              ...
          - pattern-inside: |
              import { $CLIENT } from 'aws-sdk/clients/{{.File}}'
              ...
      - pattern-either:
          - pattern: new $IMPORT.{{.Client}}(...)
          - pattern: new $CLIENT(...)
    message: AWS {{.Client}} detected
    severity: INFO
    metadata:
      features:
        - aws
        {{- with .Features }}
        {{- range . }}
        - {{.}}
        {{- end }}
        {{- end }}
      lang: javascript
    languages:
      - javascript
      - typescript
  {{- end }}
```

Based on the template, here are the data requirements for each client:

1. The `.Client` field needs the class name for the rule ID, message, and to detect client instantiation.
2. The `.File` field needs the file name (without extension) to detect client imports.
3. A list of `.Features` can be defined for specific clients to enrich the metadata.

## Step 2: Extracting the client data

As mentioned, the AWS SDK contains many clients, so we can use `grep` and `awk` to gather most of the client data.
After cloning the [AWS SDK repository](https://github.com/aws/aws-sdk-js), it's fairly easy to extract the raw data we
need:

```bash-session
$ cd aws-sdk-js/clients
$ grep -oE 'AWS\.\w+ = ' *.js
accessanalyzer.js:AWS.AccessAnalyzer =
account.js:AWS.Account =
acm.js:AWS.ACM =
acmpca.js:AWS.ACMPCA =
amp.js:AWS.Amp =
amplify.js:AWS.Amplify =
amplifybackend.js:AWS.AmplifyBackend =
amplifyuibuilder.js:AWS.AmplifyUIBuilder =
. . .
wisdom.js:AWS.Wisdom =
workdocs.js:AWS.WorkDocs =
worklink.js:AWS.WorkLink =
workmail.js:AWS.WorkMail =
workmailmessageflow.js:AWS.WorkMailMessageFlow =
workspaces.js:AWS.WorkSpaces =
workspacesthinclient.js:AWS.WorkSpacesThinClient =
workspacesweb.js:AWS.WorkSpacesWeb =
xray.js:AWS.XRay =
```
The `grep` command extracts all client class declarations along with the files where they are found. We can then use
`sed` and `awk` to process this data into a list of client information in YAML format:

```bash-session
$ grep -oE 'AWS\.\w+ = ' *.js | sed 's/\.js:AWS\./:/' | awk -F '[:,=]' '{printf "  - Client: %s\n    File: %s\n", $2, $1}'
  - Client: AccessAnalyzer
    File: accessanalyzer
  - Client: Account
    File: account
  - Client: ACM
    File: acm
  - Client: ACMPCA
    File: acmpca
. . .
  - Client: WorkMailMessageFlow
    File: workmailmessageflow
  - Client: WorkSpaces
    File: workspaces
  - Client: WorkSpacesThinClient
    File: workspacesthinclient
  - Client: WorkSpacesWeb
    File: workspacesweb
  - Client: XRay
    File: xray
```

Finally, copy and paste the output into a file under the `Clients` field to create the final data file:


```yaml
---
Clients:
  - Client: AccessAnalyzer
    File: accessanalyzer
  - Client: Account
    File: account
  - Client: ACM
    File: acm
  - Client: ACMPCA
    File: acmpca
. . .
  - Client: WorkMailMessageFlow
    File: workmailmessageflow
  - Client: WorkSpaces
    File: workspaces
  - Client: WorkSpacesThinClient
    File: workspacesthinclient
  - Client: WorkSpacesWeb
    File: workspacesweb
  - Client: XRay
    File: xray
```

## Step 3: Rendering the template

With the template and data ready, it's possible to have tatt do the rest of the work:

```bash-session
$ tatt --data semgrep_aws-sdk-js-clients.data.yaml semgrep_aws-sdk-js-clients.yaml.tmpl
---
rules:
  - id: AWSAccessAnalyzer
    patterns:
      - pattern-either:
          - pattern-inside: |
              $IMPORT = require('aws-sdk')
              ...
          - pattern-inside: |
              import { $CLIENT } from 'aws-sdk/clients/accessanalyzer'
              ...
      - pattern-either:
          - pattern: new $IMPORT.AccessAnalyzer(...)
          - pattern: new $CLIENT(...)
    message: AWS AccessAnalyzer detected
    severity: INFO
    metadata:
      features:
        - aws
      lang: javascript
    languages:
      - javascript
      - typescript
  - id: AWSAccount
    patterns:
      - pattern-either:
          - pattern-inside: |
              $IMPORT = require('aws-sdk')
              ...
          - pattern-inside: |
. . .
  languages:
      - javascript
      - typescript
  - id: AWSXRay
    patterns:
      - pattern-either:
          - pattern-inside: |
              $IMPORT = require('aws-sdk')
              ...
          - pattern-inside: |
              import { $CLIENT } from 'aws-sdk/clients/xray'
              ...
      - pattern-either:
          - pattern: new $IMPORT.XRay(...)
          - pattern: new $CLIENT(...)
    message: AWS XRay detected
    severity: INFO
    metadata:
      features:
        - aws
      lang: javascript
    languages:
      - javascript
      - typescript
```

tatt prints the rendered template to standard out, but this can of course be redirected to a file if needed.

For more information and installation instructions, see the [project README](https://github.com/michenriksen/tatt).
