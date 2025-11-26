# fibbonacchi_calculator
Over complicated fibbonacchi calculator

docker-compose -f docker-compose-dev.yml up
docker-compose -f docker-compose-dev.yml up --build
docker-compose -f docker-compose-dev.yml down



Add AWS configuration details to .travis.yml file's deploy script

Set the region. The region code can be found by clicking the region in the toolbar next to your username.
eg: 'us-east-1'

app should be set to the Elastic Beanstalk Application Name
eg: 'multi-docker'

env should be set to your Elastic Beanstalk Environment name.
eg: 'MultiDocker-env'

Set the bucket_name. This can be found by searching for the S3 Storage service. Click the link for the elasticbeanstalk bucket that matches your region code and copy the name.

eg: 'elasticbeanstalk-us-east-1-923445599289'

Set the bucket_path to 'docker-multi'

Set access_key_id to $AWS_ACCESS_KEY

Set secret_access_key to $AWS_SECRET_KEY

Setting Environment Variables

Go to AWS Management Console and use Find Services to search for Elastic Beanstalk

Click Environments in the left sidebar.

Click MultiDocker-env

In the left sidebar click Configuration

Scroll down to the Updates, monitoring, and logging section and click Edit.

Scroll down to the Environment Properties section. Click Add environment property.

In another tab Open up ElastiCache, click Redis and check the box next to your cluster. Find the Primary Endpoint and copy that value but omit the :6379

Set REDIS_HOST key to the primary endpoint listed above, remember to omit :6379

Set REDIS_PORT to 6379

Set PGUSER to postgres

Set PGPASSWORD to postgrespassword

In another tab, open up the RDS dashboard, click databases in the sidebar, click your instance and scroll to Connectivity and Security. Copy the endpoint.

Set the PGHOST key to the endpoint value listed above.

Set PGDATABASE to fibvalues

Set PGPORT to 5432

Click Apply button

After all instances restart and go from No Data, to Severe, you should see a green checkmark under Health.

IAM Keys for Deployment

You can use the same IAM User's access and secret keys from the single container app we created earlier, or, you can create a new IAM user for this application:

1. Search for the "IAM Security, Identity & Compliance Service"

2. Click "Create Individual IAM Users" and click "Manage Users"

3. Click "Add User"

4. Enter any name you’d like in the "User Name" field.

eg: docker-multi-travis-ci

5. Click "Next"

6. Click "Attach Policies Directly"

7. Search for "beanstalk"

8. Tick the box next to "AdministratorAccess-AWSElasticBeanstalk"

9. Click "Next"

10. Click "Create user"

11. Select the IAM user that was just created from the list of users

12. Click "Security Credentials"

13. Scroll down to find "Access Keys"

14. Click "Create access key"

15. Select "Command Line Interface (CLI)"

16. Scroll down and tick the "I understand..." check box and click "Next"

Copy and/or download the Access Key ID and Secret Access Key to use in the Travis Variable Setup.

AWS Keys in Travis

Go to your Travis Dashboard and find the project repository for the application we are working on.

On the repository page, click "More Options" and then "Settings"

Create an AWS_ACCESS_KEY variable and paste your IAM access key

Create an AWS_SECRET_KEY variable and paste your IAM secret key

Deploying App

Make a small change to your src/App.js file in the greeting text.

In the project root, in your terminal run:

git add.
git commit -m “testing deployment"
git push origin main
Go to your Travis Dashboard and check the status of your build.

The status should eventually return with a green checkmark and show "build passing"

Go to your AWS Elastic Beanstalk application

It should say "Elastic Beanstalk is updating your environment"

It should eventually show a green checkmark under "Health". You will now be able to access your application at the external URL provided under the environment name.



## ############################################################################## ##
##                              KUBERNATES                                        ##
## ############################################################################## ##
kubectl get deployments
kubectl get storageclass 
    --muestra los hdd disponibles para kubernates
kubectl describe storageclass
    --informacion detallada del hdd disponible

kubectl delete deployment client-deployment

kubectl get services
--no borramos el servicio kubernates, es un servicio interno que es mejor no tocar

kubectl delete service client-node-port

kubectl apply -f k8s/client-deployment.yaml
kubectl apply -f k8s
-- si usamos el directorio, kubernates aplicara los cambios de todos los ficheros dentro del directorio

--usamos clusterIP services porque no queremos que sean accesibles desde fuera del nodo

PVC = Persistant Volume Claim 
Es una forma de extraer los ficheros del contenedor del pod y guardarlos a parte. De esta manera, si el pod se borra (por un fallo o error) los ficheros de la bbdd no se perderan.
No es aconsejable que varios pods de posgres accedan al mismo volumen de datos. Se aconseja tener un solo pod de posgres.
Volume = un objeto que permite a un contenedor almacenar datos a nivel de pod. Sobrevive al reinicio de los contenedores pero no al borrado del pod. 
Persistant Volume = es un volume que no esta asociado a un pod en concreto, por lo que si es eliminado el volume persiste. Es el admin quien decide si borrarlo y cuando.
    statically provisioned persistant volume = creado anteriormente por el sistema y listo para ser usado por un pod.
    dynamically provisioned persistant volume = es creado dinamicamente cuando el pod lo solicita.
Persistant Volume Claim = es una configuracion que da opciones a los pods para acceder a un volume persistant, pero no es un volume en si mismo. 
Cuando trabajamos en local, no hay muchas opciones y parece trivial, pero existen muchos tipos de volumenes que se pueden usar o configurar (Google cloud persistent disk, Azure file, Azure disk, AWS Block store,...)
kubernates.io/docs/concepts/storage/storage-classes/ 

access modes:
    ReadWriteOnce: Puede usarse por un solo nodo
    ReadOnlyMany: Multiples nodos pueden leerlo
    ReadWriteMany: Multiples nodos pueden leer y escribir en el


Secrets = tipo de objeto para almacenar datos de manera segura
kubectl create secret <secret_type> <secret_name> --from-literal <key>=<value>
--para crear un secret de manera manual
secret_type= generic | docker-registry | tls (relacionado con http settings)

kubectl create secret generic pgpassword --from-literal PGPASSWORD=12345asdf

kubectl get secrets