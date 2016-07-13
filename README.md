# abelone

Convert scroll into a turnable bookiza app!

This module works best with public domain HTML books off Gutenberg. That is to say, it is currently optimized to handle `paragraph` and `header` tags only.

# Instructions

Abelone command is tied to alphabet 'a'.

```

  $ abelone --help or $ a -h

  $ a fetch <url>       // Step-1: Fetches the HTML page, saves it as `original.html`.

  $ abelone sanitize or $ a s            // Sanitize HTML off Gutenberg.
  $ abelone normalize or $ a n           // Normalize HTML
  $ abelone paginate or $ a p            // Paginate into book sized chunks per template.


```