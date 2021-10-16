//INTALACION DE DOCKER Y DOCKER COMPOSE EN LINUX--------------------------------

//instalar docker
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker run hello-world


//configurar docker para no poner sudo antes de docker
sudo groupadd docker

sudo usermod -aG docker $USER

newgrp docker 

docker run hello-world


//instalar docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

docker-compose --version



//dockerfiles
docker build -t <image-name> .

docker run -dp <pc-port>:<docker-port> <image-name>


//dockercompose
docker-compose -f <file.yml> up
docker-compose -f <file.yml> down


//dockerhub
docker login
docker tag <image-name> <user-docker>/<repositoy>:<tagname>
docker push <user-docker>/<repositoy>:<tagname>
docker pull <user-docker>/<repositoy>:<tagname>