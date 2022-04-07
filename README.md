<h1 align="center">Server Side Development with NodeJS and MongoDB Course</h1>

<div align="center">

[![License](https://img.shields.io/badge/license-GPL--3-blue)](/LICENSE)

</div>

---

<p align="center"> Source code for the online course Server Side Development with NodeJS and MongoDB Course. It includes a MongoDB and an API which interacts with it.
    <br> 
</p>

## 🧐 About <a name = "about"></a>

This project features several little examples:

- A basic `node` `http` web server in `node-http/`.
- An `express` version of the same server in `node-express/`.
- A local `mongodb` in `mongodb/`.
- A `node` server which communicates directly with the `mongodb` through a `mongo client` in `node-mongo/`.
- Another version of the previous one, but using `mongoose` in `node-mongoose`.
- A more complex `node` server which communicates to the local `mongodb` and exposes an API for fetching and saving data related to a restaurant. This backend is open at two ports: 3000 and 3443. The port 3000 is insecure (over `http`) and redirects to the 3443 port, which is secure (`https` server with self-signed certificate).
- Finally, another version of the previous backend, bootstrapped using `loopback`.

## 🎈 Usage <a name="usage"></a>

All applications can be run with `npm start` (previous `npm install` for installing the dependencies).

For all the applications related to the `mongodb`, the local database must be running in parallel:

```bash
mongod --dbpath=mongodb --bind_ip 127.0.0.1
```

And then start the application with `npm start`.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [NodeJS](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@nico-rodriguez](https://github.com/nico-rodriguez)

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Coursera's course *Server Side Development with NodeJS and MongoDB Course*.
