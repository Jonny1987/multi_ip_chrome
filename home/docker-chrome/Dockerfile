# Run Chrome in a container
#
# docker run -it --net host --cpuset-cpus 0 --memory 512mb -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=unix$DISPLAY -v $HOME/Downloads:/home/chrome/Downloads --security-opt seccomp=$HOME/chrome.json --device /dev/snd --device /dev/dri -v /dev/shm:/dev/shm --name chrome jess/chrome
#
# You will want the custom seccomp profile:
# 	wget https://raw.githubusercontent.com/jfrazelle/dotfiles/master/etc/docker/seccomp/chrome.json -O ~/chrome.json

# Base docker image
FROM debian:buster
LABEL maintainer "Jessie Frazelle <jess@linux.com>"

# Install Chrome
RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
	gnupg \
	hicolor-icon-theme \
	libcanberra-gtk* \
	libgl1-mesa-dri \
	libgl1-mesa-glx \
	libpango1.0-0 \
	libpulse0 \
	libv4l-0 \
	fonts-symbola \
	--no-install-recommends \
	&& curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
	&& apt-get update && apt-get install -y \
	google-chrome-stable \
	--no-install-recommends \
	&& apt-get purge --auto-remove -y curl \
	&& rm -rf /var/lib/apt/lists/*

 #Download the google-talkplugin
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
    && apt-get install sudo -y \
    && apt-get install udev -y \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sSL "https://dl.google.com/linux/direct/google-talkplugin_current_amd64.deb" -o /tmp/google-talkplugin-amd64.deb \
    && dpkg -i /tmp/google-talkplugin-amd64.deb \
    && rm -rf /tmp/*.deb \
    && apt-get purge -y --auto-remove curl

RUN apt-get update && apt-get install udev -y

 #Add chrome user
RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
    && mkdir -p /home/chrome/Downloads && chown -R chrome:chrome /home/chrome

RUN apt-get update && apt-get install xdotool -y && apt-get install xinput -y && apt-get install imagemagick -y

COPY local.conf /etc/fonts/local.conf
COPY script.sh /usr/local/bin
#COPY icons_change.sh /usr/local/bin
COPY script2.sh /usr/local/bin
COPY --chown=chrome:chrome google-chrome /home/chrome/.config/google-chrome
#COPY google-chrome2.png /usr/share/icons/hicolor/22x22/apps/google-chrome.png
#COPY google-chrome2.png /usr/share/icons/hicolor/24x24/apps/google-chrome.png
#COPY google-chrome2.png /usr/share/icons/hicolor/32x32/apps/google-chrome.png
#COPY google-chrome2.png /usr/share/icons/hicolor/48x48/apps/google-chrome.png
#COPY google-chrome2.png /usr/share/icons/hicolor/64x64/apps/google-chrome.png
#COPY google-chrome2.png /usr/share/icons/hicolor/128x128/apps/google-chrome.png
#COPY google-chrome2.png /usr/share/icons/hicolor/256x256/apps/google-chrome.png

#RUN ./usr/local/bin/icons_change.sh
#RUN sed -e 's/$/ contrib non-free/' -i /etc/apt/sources.list
#RUN apt-get update && apt-get install nvidia-detect -y && nvidia-detect
#RUN apt update && DEBIAN_FRONTEND=noninteractiv apt -t buster install -y linux-headers-4.19.0-1-all nvidia-driver-390

ENTRYPOINT [ "script.sh" ]
