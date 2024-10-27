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
if exists("b:current_syntax")
  finish
endif

runtime! syntax/go.vim

syn cluster     gotplLiteral     contains=goString,goRawString,goCharacter,@goInt,goFloat,goImaginary
syn keyword     gotplControl     contained   if else end range with template
syn keyword     gotplFunctions   contained   and html index js len not or print printf println urlquery eq ne lt le gt ge
syn match       gotplVariable    contained   /\$[a-zA-Z0-9_]*\>/
syn match       goTplIdentifier  contained   /\.[^[:blank:]}]\+\>/
syn match       gotplDelimiter   contained "{{\|}}" containedin=ALL

hi def link     gotplControl        Keyword
hi def link     gotplFunctions      Function
hi def link     goTplVariable       Special
hi def link     gotplDelimiter      Special

syn region gotplAction start="{{" end="}}" contains=@gotplLiteral,gotplControl,gotplFunctions,gotplVariable,goTplIdentifier containedin=ALL transparent
syn region goTplComment start="{{\(- \)\?/\*" end="\*/\( -\)\?}}" containedin=ALL transparent

hi def link gotplAction PreProc
hi def link goTplComment Comment

let b:current_syntax = "gotmpl"
" vim: sw=2 ts=2 et
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
