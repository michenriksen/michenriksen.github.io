---
title: Highlight syntax in Go templates
date: 2024-10-27
categories: [Neovim, Golang]
---

Go [template] files are often named example.html.tmpl or example.md.tmpl to indicate they’re templates for specific formats.

However, the .tmpl extension can prevent Neovim from highlighting the underlying syntax, making them harder to edit.

Here’s how to configure Neovim to highlight these files correctly:

Create the file `~/.config/$NVIM_APPNAME/syntax/gotmpl.vim` with the following content to configure basic highlighting
of Go template code in `{{ ... }}` delimiters:

```vim
" Copyright 2011 The Go Authors. All rights reserved.
" Use of this source code is governed by a BSD-style
" license that can be found in the LICENSE file.
"
" gotpl.vim: Vim syntax file for Go templates.

" Quit when a (custom) syntax file was already loaded
if exists("b:current_syntax")
  finish
endif

syn case match

" Go escapes
syn match       goEscapeOctal       display contained "\\[0-7]\{3}"
syn match       goEscapeC           display contained +\\[abfnrtv\\'"]+
syn match       goEscapeX           display contained "\\x\x\{2}"
syn match       goEscapeU           display contained "\\u\x\{4}"
syn match       goEscapeBigU        display contained "\\U\x\{8}"
syn match       goEscapeError       display contained +\\[^0-7xuUabfnrtv\\'"]+

hi def link     goEscapeOctal       goSpecialString
hi def link     goEscapeC           goSpecialString
hi def link     goEscapeX           goSpecialString
hi def link     goEscapeU           goSpecialString
hi def link     goEscapeBigU        goSpecialString
hi def link     goSpecialString     Special
hi def link     goEscapeError       Error

" Strings and their contents
syn cluster     goStringGroup       contains=goEscapeOctal,goEscapeC,goEscapeX,goEscapeU,goEscapeBigU,goEscapeError
syn region      goString            contained start=+"+ skip=+\\\\\|\\"+ end=+"+ contains=@goStringGroup
syn region      goRawString         contained start=+`+ end=+`+

hi def link     goString            String
hi def link     goRawString         String

" Characters; their contents
syn cluster     goCharacterGroup    contains=goEscapeOctal,goEscapeC,goEscapeX,goEscapeU,goEscapeBigU
syn region      goCharacter         start=+'+ skip=+\\\\\|\\'+ end=+'+ contains=@goCharacterGroup

hi def link     goCharacter         Character

" Integers
syn match       goDecimalInt        contained "\<\d\+\([Ee]\d\+\)\?\>"
syn match       goHexadecimalInt    contained "\<0x\x\+\>"
syn match       goOctalInt          contained "\<0\o\+\>"
syn match       goOctalError        contained "\<0\o*[89]\d*\>"
syn cluster     goInt               contains=goDecimalInt,goHexadecimalInt,goOctalInt
" Floating point
syn match       goFloat             contained "\<\d\+\.\d*\([Ee][-+]\d\+\)\?\>"
syn match       goFloat             contained "\<\.\d\+\([Ee][-+]\d\+\)\?\>"
syn match       goFloat             contained "\<\d\+[Ee][-+]\d\+\>"
" Imaginary literals
syn match       goImaginary         contained "\<\d\+i\>"
syn match       goImaginary         contained "\<\d\+\.\d*\([Ee][-+]\d\+\)\?i\>"
syn match       goImaginary         contained "\<\.\d\+\([Ee][-+]\d\+\)\?i\>"
syn match       goImaginary         contained "\<\d\+[Ee][-+]\d\+i\>"

hi def link     goInt        Number
hi def link     goFloat      Number
hi def link     goImaginary  Number

" Token groups
syn cluster     gotplLiteral     contains=goString,goRawString,goCharacter,@goInt,goFloat,goImaginary
syn keyword     gotplControl     contained   if else end range with template
syn keyword     gotplFunctions   contained   and html index js len not or print printf println urlquery eq ne lt le gt ge
syn match       gotplVariable    contained   /\$[^ ]*\>/
syn match       goTplIdentifier  contained   /\.[^ ]*\>/

hi def link     gotplControl        Keyword
hi def link     gotplFunctions      Function
hi def link     goTplVariable       Special

syn region gotplAction start="{{" end="}}" contains=@gotplLiteral,gotplControl,gotplFunctions,gotplVariable,goTplIdentifier display
syn region gotplAction start="\[\[" end="\]\]" contains=@gotplLiteral,gotplControl,gotplFunctions,gotplVariable display
syn region goTplComment start="{{/\*" end="\*/}}" display
syn region goTplComment start="\[\[/\*" end="\*/\]\]" display

hi def link gotplAction PreProc
hi def link goTplComment Comment

let b:current_syntax = "gotmpl"
```

Next, add the following [autocmd] to your configuration to automatically set up correct highlighting when a `*.tmpl`
file is opened or created:

```lua
vim.api.nvim_create_autocmd({ 'BufRead', 'BufNewFile' }, {
  group = vim.api.nvim_create_augroup('gotmpl_highlight', { clear = true }),
  pattern = '*.tmpl',
  callback = function()
    local filename = vim.fn.expand('%:t')
    local ext = filename:match('.*%.(.-)%.tmpl$')

	-- Add more extension to syntax mappings here if you need to.
    local ext_filetypes = {
      go = 'go',
      html = 'html',
      md = 'markdown',
      yaml = 'yaml',
      yml = 'yaml',
    }

    if ext and ext_filetypes[ext] then
      -- Set the primary filetype
      vim.bo.filetype = ext_filetypes[ext]

      -- Define embedded Go template syntax
      vim.cmd([[
        syntax include @gotmpl syntax/gotmpl.vim
        syntax region gotmpl start="{{" end="}}" contains=@gotmpl containedin=ALL
        syntax region gotmpl start="{%" end="%}" contains=@gotmpl containedin=ALL
      ]])
    end
  end,
})
```

{{< admonition >}}
The highlighting of Go template code doesn't always work as the main language highlighting takes precedence under some
circumstances. I would love to know if anyone has a fix for this!
{{< /admonition >}}

[template]: https://pkg.go.dev/text/template
[autocmd]: https://neovim.io/doc/user/autocmd.html