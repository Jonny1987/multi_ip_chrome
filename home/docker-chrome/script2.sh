port=$(udevadm info -p /sys/class/net/eth1 | head -n 1 | cut -d"/" -f 7)
echo $port | tee /sys/bus/usb/drivers/usb/unbind && echo $port | tee /sys/bus/usb/drivers/usb/bind
