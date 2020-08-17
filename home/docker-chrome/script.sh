#!/bin/bash
sleep 8

# The following gets the ip address of the current network adaptor

# The loop is because it was unreliable getting the ip from ifconfig.me so up 8 attempts were made
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



# Get the udev port of the network adator
port=$(udevadm info -p /sys/class/net/eth1 | head -n 1 | cut -d"/" -f 7 | cut -d"." -f 2)

# This is a hack to allow us to see which network adatpor each chrome instance is associated with.
# This is useful if there is a problem so we know which adaptor to manually reset.
# A bookmart is created in that chrome instance with the same of the udev port
bookmarks_txt=$(</home/chrome/.config/google-chrome/Default/Bookmarks)
bookmarks_txt=${bookmarks_txt/PORT_HERE/$port}
echo $bookmarks_txt > /home/chrome/.config/google-chrome/Default/Bookmarks

source /home/chrome/ips
old_ip=${ips[port]}

if [ $ip == $old_ip ]
then
    # We want to know if the ip changed when the network adator was reset (useful for applications where
    # accessing a site with ip tracking and don't want to be tracked as the same user).
    # Some adaptors automatically change up address but this doesn't happen every reset.
    sudo -u chrome google-chrome --no-first-run /home/chrome/same_ip.html
else
    ips[$port]=$ip
    declare -p ips > /home/chrome/ips
    # For some reason we need to disconnect and reconnect the network adaptor once
    # we have opened chrome, otherwise it can't connect to the internet
    sudo -u chrome google-chrome --no-first-run $1 && /usr/local/bin/script2.sh
fi
