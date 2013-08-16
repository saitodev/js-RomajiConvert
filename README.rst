############################################################
js-RomajiConvert
############################################################

js-RomajiConvert is a library for converting from *Hiragana* and/or *Katakana* to *Romaji*.
This library is implemented in JavaScript and depends on `jQuery <http://jquery.com/>`_.

How to use
========================================

1. Edit table.txt and run *make*.

2. Import jquery.js, table.js and convert.js in your HTML.

3. Run RomajiConvert.convert in your JavaScript.::

     romaji_strings = RomajiConvert.convert(src_string);
     
   Example::

     romaji_strings = RomajiConvert.convert("しじょうさいしょう");
     // then, romaji_strings = ["sizyousaisyou", "sizyousaishou", "sijousaisyou", "sijousaishou", "shizyousaisyou", "shizyousaishou", "shijousaisyou", "shijousaishou"]
