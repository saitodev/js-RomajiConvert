PYTHON=/usr/bin/env python

all: table.js

table.js : table.txt mktable.py
	$(PYTHON) mktable.py table.txt table.js

clean:
	rm -f table.js

