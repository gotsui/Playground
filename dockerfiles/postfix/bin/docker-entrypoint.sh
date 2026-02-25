#!/bin/bash

DockerNetwork=$(ip r | grep -v 'default' | grep 'eth0' | awk '{print $1}')
echo $DockerNetwork > /etc/postfix/mynetworks

exec "$@"