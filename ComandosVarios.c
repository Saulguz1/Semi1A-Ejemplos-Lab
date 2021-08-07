// Modulos---------------------------

// crear modulo
sudo make

//instalar  modulo
sudo insmod prueba.ko

//eliminar modulo
sudo rmmod prueba.ko

//DOCKER --------------------------------------

// constuir imagen
 docker build -t micro_eliminar .

// Correr dockerfile 
docker run -dit --name appwebace -p 80:80 appwebace
docker run -dit --name pythonserver -p 5000:5000 python

// Ver iamgenes
 docker images -a
 docker images ls

// eliminar imagen
 docker rmi id
// eliminar todas las imagenes
docker rmi $(docker images -a -q)

//ver contenedores
docker ps -a

//eliminar contenedores
docker rm id

//correr y detener contenedor
docker stop id
docker start id

//detener todos los contenedores
docker stop $(docker ps -q)

// Levantar docker-compose con consola y sin consola
docker-compose up --build -d
docker-compose up --build


docker-compose -f  up  --build -d
// bajar todos los contenedores del dockercompse 
docker-compose down 

// Ver el espacio del sistema de docker
docker system df

// Eliminar todos los volumenes de docker
docker volume prune

//Eliminar todas las imagenes de docker
docker image prune

//Eliminar diversos componentes de docker
docker system prune


//ver redes
docker network ls

//Ver detalladamente una red
docker network inspect redes2_1s2021_grupo21_service_network

//Acceder a un contenedor
docker exec -i -t 7d5ea /bin/bash

//CLONAR UN CONTENEDOR

docker stop test01
docker commit test01 test02
docker run -p 8080:8080 -td test02

//CONFIGURAR ARCHIVO DE ARRANQUE

//Detener todas las instancias
dokcer stop id
// ingresar a carpeta
sudo cd /var/lib/docker/containers/
// configurar el archivo segun el id del contenedor
sudo nano /var/lib/docker/containers/[id_hash_of_the_container]/hostconfig.json

//Cambiar el archivo en este caso mapear puerto , guardar cambios
"PortBindings":{"5432/tcp":[{"HostIp":"","HostPort":"5432"}]}

// reiniciar docker service
sudo systemctl restart docker
// levantar contenedores
docker start id


// REACT JS -----------------------------------------
//instalacion de react
sudo apt install nodejs
sudo apt install npm
npm install -g create-react-app
npx create-react-app appservidor
npm install --save react-chartjs-2 chart.js
npm install --save reac-idle-timer



//ANGULAR-------------------------------------
//instalar angular
sudo apt install nodejs
sudo apt install npm
sudo npm install -g @angular/cli

//iniicar angular
ng serve


//PYTHON--------------------------------------------

//instalar dependencias
python -m pip install flask


//NODE JS------------------------------------------
//iniciar proyecto
npm init -f 

//instalar dependencias
npm install cors 
npm install express 
npm install body-parser
npm install uuid
npm install aws-sdk

//correr servidor
node index.js


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

//CASSANDRA----------------------------------------------------------------------------

nodetool status
iniciar cqlsh


//TYPESCRIT--------------------------------
tsc -w












