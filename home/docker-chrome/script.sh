#!/bin/bash
sleep 8

for i in {0..7}
do
    sleep 1
    ip=$(curl ifconfig.me)
    ip=$([[ $ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; echo ${BASH_REMATCH[0]})
    if [ ! -z $ip ]
    then
        break
    fi
done

source /home/chrome/ips
port=$(udevadm info -p /sys/class/net/eth1 | head -n 1 | cut -d"/" -f 7 | cut -d"." -f 2)
old_ip=${ips[port]}

bookmarks_txt=$(</home/chrome/.config/google-chrome/Default/Bookmarks)
bookmarks_txt=${bookmarks_txt/PORT_HERE/$port}
echo $bookmarks_txt > /home/chrome/.config/google-chrome/Default/Bookmarks

if [ $ip == $old_ip ]
then
    sudo -u chrome google-chrome --no-first-run /home/chrome/same_ip.html
else
    ips[$port]=$ip
    declare -p ips > /home/chrome/ips
    sudo -u chrome google-chrome --no-first-run $1 && /usr/local/bin/script2.sh
fi
