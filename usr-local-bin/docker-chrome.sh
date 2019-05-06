#!/bin/bash


ns=$1

echo $(id)
echo $(id -u)
container=mycontainer-$ns
docker rm -f $container
ip netns del $ns
#sudo -u john xhost +local:root
touch /usr/local/bin/webpage
source /usr/local/bin/webpage
echo webpage\:$webpage
docker run -dit --runtime=nvidia --cpuset-cpus 0 -v /usr/local/bin/ips:/home/chrome/ips -h localhost -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=:0 -v $HOME/Downloads:/home/chrome/Downloads --security-opt seccomp=/usr/local/bin/chrome.json --device /dev/snd --device /dev/dri -v /dev/shm:/dev/shm --net none -v /home/john/Docker/gambling/documents:/home/chrome/documents --name $container docker-chrome4 $webpage;
pid=$(sudo docker inspect --format '{{.State.Pid}}' $container);
mkdir -p /var/run/netns;
ln -sf /proc/$pid/ns/net /var/run/netns/$ns;
