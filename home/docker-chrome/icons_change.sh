#!/bin/bash

numbers=(22 24 32 48 64 128 256)
for i in ${numbers[@]}
do
    file=/usr/share/icons/hicolor/"$i"x"$i"/apps/google-chrome.png
    echo $file
    halfway=$(($i / 2 + 10))
    echo $halfway
    convert -pointsize 20 -fill black -draw "text 5,$halfway '$i'" $file $file
done
sudo update-icon-caches /usr/share/icons/*
