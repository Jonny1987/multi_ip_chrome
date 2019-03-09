grep -n GRUB_CMDLINE_LINUX= /etc/default/grub | cut -d':' -f 1 | xargs -I {} sudo sed -i '{}s/.*/GRUB_CMDLINE_LINUX\=\"net.ifnames=0 biosdevname=0\"/' /etc/default/grub
ln -fs /lib/udev/rules.d/80-net-setup-link.rules /etc/udev/rules.d/80-net-setup-link.rules
cp etc-systemd-network/01-huawei-e3372h.link /etc/systemd/network/
cp etc-systemd-system/addif@.service /etc/systemd/system/
cp etc-udev-rules.d/1-physical-netns.rules /etc/udev/rules.d/
udevadm control --reload && udevadm trigger
cp -r home/docker-chrome/ ~/
cp -r usr-local-bin/* /usr/local/bin/
touch /usr/local/bin/webpage

# install docker
apt update
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# install fish
apt-add-repository ppa:fish-shell/release-3
apt-get update
apt-get install -y fish

#install other stuff
apt-get install -y xdotool wmctrl xterm git vim-gnome

# clone autoclicker
cd ~
wget https://github.com/Jonny1987/autclicker/archive/master.zip -O master.zip
unzip master.zip
rm master.zip

wget https://github.com/Jonny1987/dotfiles/archive/master.zip -O master.zip
unzip master.zip
rm master.zip

cp dotfiles-master/.bashrc ~/.bashrc
cp dotfiles-master/.vimrc ~/.vimrc
cp dotfiles-master/.gitconfig ~/.gitconfig

. ~/.bashrc
