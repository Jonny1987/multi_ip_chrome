sudo grep -n GRUB_CMDLINE_LINUX= /etc/default/grub | cut -d':' -f 1 | xargs -I {} sudo sed -i '{}s/.*/GRUB_CMDLINE_LINUX\=\"net.ifnames=0 biosdevname=0\"/' /etc/default/grub
sudo ln -fs /lib/udev/rules.d/80-net-setup-link.rules /etc/udev/rules.d/80-net-setup-link.rules
sudo cp etc-systemd-network/01-huawei-e3372h.link /etc/systemd/network/
sudo cp etc-systemd-system/addif@.service /etc/systemd/system/
sudo cp etc-udev-rules.d/1-physical-netns.rules /etc/udev/rules.d/
sudo udevadm control --reload && udevadm trigger
sudo cp -r home/docker-chrome/ ~/
sudo cp -r usr-local-bin/* /usr/local/bin/
sudo touch /usr/local/bin/webpage

# install docker
sudo apt update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# install fish
sudo apt-add-repository ppa:fish-shell/release-3
sudo apt-get update
sudo apt-get install -y fish

#install other stuff
sudo apt-get install -y xdotool wmctrl xterm git vim-gnome

# clone autoclicker
cd ~
mkdir autoclicker
wget -c https://github.com/Jonny1987/autclicker/archive/master.zip -O - | unzip -d autoclicker

mkdir dotfiles
wget -c https://github.com/Jonny1987/dotfiles/archive/master.zip -O - | unzip -d dotfiles

cd dotfiles
./run_me.sh
. ~/.bashrc
