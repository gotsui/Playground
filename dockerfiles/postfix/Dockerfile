# Use AlmaLinux 9 as the base image
FROM almalinux:9

# Install Postfix
RUN dnf -y install postfix s-nail

# Set up environment to avoid Postfix from asking questions
ENV DEBIAN_FRONTEND=noninteractive

# Open the SMTP port
EXPOSE 25

# Start Postfix
CMD ["postfix", "start-fg"]