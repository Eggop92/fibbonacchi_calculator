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


services:
    clusterIP: Exposes a set of pods to other objects in the cluster
    NodePort: Exposes a set of pods to the outside world (only good for dev proposes)
    LoadBalancer: Legacy way of getting network traffic into a cluster. Only give access to one set of services. Cannot expose multiple services (aka front and backends)
    Ingress: Exposes a set of services to the outside world. Vamos a usar el projecto *ingress-nginx*(github.com/kubernetes/ingress-nginx) no el projecto _kubernates-ingress_, son dos muy distintos. La configuracion de ingress depende del environment que se use, cambia segun sea local, GC, AWS o azure. Nosotros usamos local y GC.

Un controlador en kubernates es cualquier objeto que realiza cambios para obtener un nuevo estado.
Creamos un fichero de configuracion para ingress. Este creara un pod con ingress dentro que gestionara las llamadas y las redireccionara a los servicios correspondientes.
Usando la configuracion de google cloud load balancer. Este creara un balancer que recibira todo el trafico y sera este quien lo redireccion a multi-client, multi-server y a un default que el mismo ingress creara por defecto. 
+ info: https://www.joyfulbikeshedding.com/blog/2018-03-26-studying-the-kubernetes-ingress-system.html

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.14.0/deploy/static/provider/cloud/deploy.yaml
--aplica la configuracion de ingress-nginx



In the upcoming lecture, we will be creating our ingress-service.yaml configuration file. Since the recording of the lecture, there has been a major API update as well as a change in how we need to specify some of these rules.
The v1 Ingress API is now required as of Kubernetes v1.22 and the v1beta1 will no longer work.

Required changes (scroll to bottom for full code):
-Update apiVersion to v1
-Add use-regex annotation to address certain 404 errors on localhost and Google Cloud
-Update rewrite-target annotation
-Add PathType to each path
-Modify serviceName and servicePort fields to use the new syntax.
-Update "/" and "/api" paths to resolve TypeError: this.state.seenIndexes.map is not a function error
-Remove the Ingress class Annotation
-Add ingressClassName field under "spec"

Documentation link for reference:
https://kubernetes.io/docs/concepts/services-networking/ingress/


## ################################################################################## ##
##                       INSTALL KUBERNATES DASHBOARD                                 ##
## ################################################################################## ##

1. Install Helm

Following the instructions provided here, run the three following commands in your terminal:
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3

chmod 700 get_helm.sh

./get_helm.sh

2. Deploy Kubernetes Dashboard

Run the following two commands in your terminal:

helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/

helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard

3. Create a dash-admin-user.yaml file and paste the following:

apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard


4. Apply the dash-admin-user configuration:
kubectl apply -f dash-admin-user.yaml

5. Create dash-clusterrole-yaml file and paste the following:

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: admin-user
    namespace: kubernetes-dashboard


6. Apply the ClusterRole configuration:
kubectl apply -f dash-clusterrole.yaml

7. In the terminal, run:

kubectl -n kubernetes-dashboard port-forward svc/kubernetes-dashboard-kong-proxy 8443:443

Important - You must keep this terminal window open and the proxy running!

8. Visit the following URL in your browser to access your Dashboard:
https://127.0.0.1:8443/#/login

Important - visiting localhost:8443 instead of 127.0.0.1:8443 will result in authentication failure!

9. Obtain the token

In your terminal, run the following command:

kubectl -n kubernetes-dashboard create token admin-user

10. Copy the token from the above output
Copy and paste the token into the login form of the dashboard. Be careful not to copy any extra spaces or output such as the trailing % you may see in your terminal.

11. After a successful login, you should now be redirected to the Kubernetes Dashboard.



The above steps can be found in the official documentation:

https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md