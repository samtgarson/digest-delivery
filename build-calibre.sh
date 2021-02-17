#!/bin/bash
mkdir -p calibre/bin
cd calibre/bin
rm -rf *

# will download the lastest release
curl -s https://api.github.com/repos/kovidgoyal/calibre/releases/latest \
| grep "browser_download_url.*64.txz" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -

tar -xf calibre-*.txz
rm calibre-*.txz

# remove some files to hit the 250MB layer limit
# rm lib/libQt5WebEngineCore.so.5
rm resources/viewer.js
rm -rf resources/images
