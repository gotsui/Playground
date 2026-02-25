# Use AlmaLinux 9 as the base image
FROM almalinux:9

# Install Postfix
RUN dnf -y install postfix s-nail iproute

# Set up environment to avoid Postfix from asking questions
ENV DEBIAN_FRONTEND=noninteractive

# Open the SMTP port
EXPOSE 25

COPY ./dockerfiles/postfix/bin/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

# Start Postfix
CMD ["postfix", "start-fg"]