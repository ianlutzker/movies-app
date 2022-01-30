# TL;DR

Clone / Fork

<br>

```bash:
git clone https://github.com/ianlutzker/movies-app.git
```

<br>

Then:

1. Modify `Activate Namespace` > `name:` in `.github/workflows/main.yml` and `baseURL: 'https://server-`YOUR_NAMESPACE`.cloud.okteto.net/api'` in `client/src/api/index.js`

2. Add your Okteto token to the Github repository in `Settings > Secrets > Actions > New repository secret >` Name = `OKTETO_TOKEN`

3. Commit, push and enjoy the automated deployment!

<br>

# movies-app from a DevOps perspective

<br>

Some time ago I was given a DevOps exercise to create, build and deploy an architecture for a distributed web application, using containers that can interact with each other. It will be covered in this article: I'll create a MERN stack web application that allows to perform CRUD operations, then I'll deploy it to a Kubernetes running in Okteto Cloud and automate the deploy with Github Actions. 

The web application must contain the following components:

- Client Web App in React
- Backend API in Node.js
- DB in MySQL (I'll use MongoDB instead)

<br>

[A. Create a sample application with all the different parts involved](#a)

[B. Build an architecture to deploy the application using Docker containers](#b)

[C. Deploy the application into the cloud and make it accessible to the world](#c)

[D. Automate the deploy creating scripts or using a tool for deployment](#d)

<br>

---
<a id="a"></a>

## A. Create a sample application with all the different parts involved

As I am not a developer, creating the MERN stack from scratch was going to be practically impossible, so I decided to follow [Sam Barro's guide](https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66) that perfectly details the whole process.

Before deploying the app to the cloud I am going to test it locally to verify that everything works correctly. For this I'll use:

- Docker Engine + Docker Compose (Docker Desktop)
- Node.js to install the yarn modules needed and to run the apps locally
- Postman to test the API (Optional)
- MongoDB which I'm going to run directly in Docker to avoid an extra installation in my machine. More about this down below.

<br>

### __Backend Server__

The guide starts with the server setup. I found no problems here, it is very straightforward. My only recommendation is to start the server with the `nodemon index.js` command as to visualize changes in real time. If it returns an error you'll have to install it with the command `sudo npm install -g nodemon` in the server folder.

<br>

### __MongoDB__

<br>

As I mentioned before, I'm going to run the database directly in Docker with the use of Compose in order to, later on, integrate the Backend and Frontend containers. I'm going to create the `docker-compose.yml` file following the steps from the official Mongo DB guide at [Docker Hub](https://hub.docker.com/_/mongo), and will get it to run:

<br>

```bash:
docker-compose up
```

<br>

Optionally, if you need a tool to visualize the database prior to testing in Postman, use Mongo Express in Compose.

Note: I'm not going to save the content of the Mongo database since it is a demo but if you want to do it, create a mongo-data folder inside the server folder and add this command to the Compose file.

```yaml
volumes: 
  - "$PWD/mongo-data:/data/db" 
```
> <br>
>
> __MongoDB Errors__
>
> <br>
>
> The only problem I had was with the connection to Mongo DB. Thanks to this [article](https://www.bezkoder.com/docker-compose-nodejs-mongodb) I learned how to do it right. This meant adding `username`, `password` and `authSource` to the connection string in the `server/db/index.js` file as follows:
>
> <br>
>
> ```javascript
> 'mongodb://localhost:27017/cinema' > 'mongodb://root:example@localhost:27017/cinema?authSource=admin'
> ```
>
> <br>

<br>

Here's a screenshot of a successful testing with Postman 👍🏻
![](./img/08.png)


### __Frontend client__

So far so good, we have the Backend up and running: it connects successfully to the database and only the Frontend is left. This is where things got complicated. Sam's guide is from 2019, which means some modules were updated and the way they are used changed. For example:

<br>

> <br>
>
> __React Router Errors__
>
>
> In the last version of React Router (v6) the `Switch` component changed to `Routes`, and you can no longer use the props `component` because it was replaced by [element](https://github.com/remix-run/react-router/blob/main/docs/upgrading/v5.md#advantages-of-route-element). All of this caused the following errors upon debbuging: 
> 
> ![](./img/01.png)
>
> ![](./img/05.png)
>
> <br>
>
> __Solution:__ Replace `<`Switch`>` with `<`Routes`>` and `<Route path="/" exact `component`={MoviesList} />` with `<Route path="/" exact `element`={<Home />}></Route>` in the `client/src/app/index.js` file like this:
>
> <br>
>
> ![](./img/06.png)
>
> <br>

<br>

> <br>
>
> __React Table Errors__
>
> Sadly, React Table v7 doesn't support the `react-table.css` file. 
> 
> ![](./img/03.png)
>
> I solved this by installing the previous version of React Table (v6) with the command `yarn add react-table-6` in the `client` folder and then reconfiguring the lines as pinned in the image below.
>
> ![](./img/04.png)
>
> <br>

<br>

After correcting all these errors the entire stack worked! 👍🏻

<br>

![](./img/07.png)

<br>

---
<a id="b"></a>

## B. Build an architecture to deploy the application using Docker containers

With both applications working well locally, I'm going to containerize them to run in Compose.

For this I created the `Dockerfile` for each app using the official [Node.js image](https://hub.docker.com/_/node) from Docker Hub in its `node:alpine` flavour (smallest one possible) and added them to the `docker-compose.yml` already created for Mongo.

<br>

![](./img/19.png)

<br>

I don't cover the `docker build` nor the container registry `docker push` processes since I do it directly in Compose by building and storing both images locally, and I also don't talk in detail about how to create the `Dockerfile` mentioned above, for which you can use my files from the repository, or [these](https://github.com/sidpalas/mern-docker-compose).

<br>

__NOTE:__ Before running the `docker-compose up` command, the `localhost` needs to be changed to `mongo` in the `server/db/index.js` otherwise it won't work.

<br>

![](./img/10.png)

---
<a id="c"></a>

## C. Deploy the application into the cloud and make it accessible to the world

The app is now ready for the Cloud. For this, you can use your provider of choice: from a VM to a Kubernetes cluster, it's up to you. I'm going to use Okteto Cloud because it allows to deploy directly from Github without the need to generate a manifest, and it also supports Github Actions that I'll use in the next step to automate this process.

<br>

`git push` and `Deploy` 🚀

![](./img/11.png)

![](./img/12.png)

![](./img/13.png)

![](./img/14.png)

<br>

![](./img/15.png)

<br>

----
<a id="d"></a>

## D. Automate the deploy creating scripts or using a tool for deployment

To wrap it up, I'm going to automate the deploy so when there's a new commit or push ("the trigger") in the repository, the pipeline is destroyed and redeployed with the latest improvements (or detriments! ha). Okteto Cloud provides its own [modules](https://www.okteto.com/docs/cloud/github-actions/) to use in a Github Actions workflow (CI/CD).

The ones I'm going to use are:

- [Trigger](https://docs.github.com/en/enterprise-cloud@latest/actions/using-workflows/events-that-trigger-workflows#push)
- [Context](https://github.com/marketplace/actions/okteto-context)
- [Activate Namespace](https://github.com/marketplace/actions/activate-namespace)
- [Destroy the current pipeline](https://github.com/marketplace/actions/destroy-okteto-pipeline)     
- [Trigger the new pipeline](https://github.com/marketplace/actions/okteto-pipeline)

to create this script:

[.github/workflows/main.yml](.github/workflows/main.yml)

You need to generate a token in Okteto and configure it in the Github repository in `Settings > Secrets > Actions > New repository secret >` Name = `OKTETO_TOKEN` for the script to work. More info about this [here](https://www.okteto.com/blog/how-to-deploy-to-okteto-cloud-with-github-actions).

Finally, commit, push and enjoy the automated deployment! 

![](./img/16.png)
![](./img/17.png)
![](./img/18.png)