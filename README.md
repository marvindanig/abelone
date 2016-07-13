# abelone

Convert scroll into a turnable bookiza app!

This module works best with public domain HTML books off Gutenberg. That is to say, it is currently optimized to handle `paragraph` and `header` tags only.

# Install

```
  
  $ npm i -g abelone

```

`--global` flag is required because this is a command line utility.


# Instructions

Abelone command is tied to the alphabet 'a'.

```

  $ abelone --help or $ a -h

  $ abelone fetch <url> or $ a f <url>   // Fetches the HTML, saves it as `original.html`.

  $ abelone sanitize or $ a s            // Sanitize HTML off Gutenberg.
  
  $ abelone normalize or $ a n           // Normalize HTML
  
  $ abelone paginate or $ a p            // Paginate into book sized chunks per template.


```

Done! The html page is now chunked into manuscript of your [bookiza](https://bookiza.io) app.