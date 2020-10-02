# Pizza App

## How to launch app

Run next  command for loading repository files

`git clone https://github.com/<repository>/<git_file_path>.git`

Rename `.env.example` into `.env`

Then run next command for launching docker environment

`docker-compose up -d`

Note: it uses 80 port from your host machine

*Undone from task scope:*
- test with jest for frontend application

### Documentation 

After launching docker-compose. Documentation will be available: 
- Backend documentation available under [http://localhost/api/docs](http://localhost/api/docs)
- Frontend documentation available under [http://localhost/docs/index.html](http://localhost/docs/index.html)

# Follow-up questions:

#### Question 

How would you deal with customers, who would like to create their own pizza: base dough plus their favourite ingredients. How would you design a database for this task?

#### Answer

In current solution the functionality of the build your set of pizza's ingredients is given. But if user want to have ability to create his own ingredient, make  modification in Ingredient set component would be enough.

#### Question 

How would you deal with a customer, who would like to add some extras? For example, I would like to get extra cheese in all pizzas in my order and extra tomatoes in one of the pizzas. How would you design a database for this task?

#### Answer

To give ability for user to make custom ingredients set, needs:
 - have pizza and ingredients normalized by separate database tables with having pivot table of the relationship between Pizza and Ingredients.
 - Mentioned before pivot table should contain a count property of the relationship.
 - API endpoint should be configured to maintain table structure of Pizza, Ingredient and pivot tables (ORM) and have ability to serialize it.
 - if api message structure changed, then frontend should know how to process new message structure and render pizza table based on it. 

#### Question

A question to think about: how would you design a system if you have CPU heavy long-running (5min plus) machine learning task that needs to be executed in order to recommend the best pizza for registered customers (later sent via email) - make a diagram.

#### Answer

I would decompose systems by small services:
- backend - handle user requirest and gives response, work with cache (Redis or Elastic (important that it should be quick read side) where would be stored recommendations and set tasks to ML recommendation module via task queue (eg. Celerity) or message broker.
- ML pizza recommendation module - I would let it interact with backend part system via get task queue, saving results of the recommendation to the mentioned above cache, so backend could use it from it.
Current decomposition can let us separate CPU loading by two flows.
- backend and user request handling is high priority
- and ML recommendation calculation low priority, could be launched as single thread

#### Requirement

Spend no more than 4 hours in total, prioritize what is most important to have in your opinion.

#### Answer

The deadline requirement is not satifyied, but I really enjoyed to get experience with 

- FastAPI, 
- SQLAlchemy, 
- ReactHooks, 
- Antd 
- Github Actions (which is just a small attempt).

Thank you very much for given assessment!!!!! I already got new experience.

# fullstack-task
Fullstack task

# Task
The Challenge is to design and implement client and a backend API for a pizza shop.

## Client technology stack

+ react
+ restful-react or *react-query* or useSwr for communication with server
+ html
+ javascript or typescript
+ css/scss/less
+ use create-react-app
- jest for tests
+ antd/bootstrap or other framework

### Tasks for the client

Should contain one of the following pages (you can choose which one): make pizza, list of pizzas with statuses

### Description of these pages

Make a pizza order:

+ name of pizza (input),
+ ingredients (multiple select of ingredients (hardcoded in code))(make a pizza order with status waiting at default)

List of pizza orders:

+ table (sorting, search, pagination) with columns (name, ingredients, status, action).
+ In action column - select to change status of pizza

Hardcoded data:

+ Ingredients: cheese, bacon, mushrooms, ananas
+ Statuses: waiting, ready

## Server technology stack

+ Postgres database
+ use Python-based server
+ Python 3, asyncio (highly preferably)

### Your tasks on the server side

+ 1 endpoint of your choice: CREATE, READ, UPDATE, DELETE, LIST objects
+ Cover your code with tests
+ Document your endpoints (you can use any autogenerator for documentation)
+ Use linters and formatters
- Publish your code on github, integrate CI to run linters, formatters, tests (on both frontend and backend sides).
+ Simple documentation would be a plus (feel free to use any auto-generators available).
+ Dockerize your solution, provide a readme with clear instructions how to run the code.

Please take a look into our follow-up questions and send us in a written form (no coding required) via email.
