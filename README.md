# fibbonacchi_calculator
Over complicated fibbonacchi calculator


In the next lecture, we will be adding some Nginx config to the client-side project, but I neglected to add one line that would get the Nginx server to work correctly when using React Router!

In the client/nginx/default.conf file, please add the following line to the end of the location directive:

    try_files $uri $uri/ /index.html;

The default.conf should now look like this:

server {
  listen 3000;
 
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}