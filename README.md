## TDT eBanking Web App

[![CircleCI](https://img.shields.io/circleci/project/github/contentful/the-example-app.nodejs.svg)](https://circleci.com/gh/contentful/the-example-app.nodejs)

Working on Project in Advanced Website Development

- A simple eBanking system for TDT Student
- having basic functionality of simple eBanking Web App
- Stick to project description

## Requirements

* [Nodejs (version 16.15 .00 or above)](https://nodejs.org/en/)
* [MongoDB Community Server (Version 5.0.8 or above)](https://www.mongodb.com/try/download/community)
* Required Nodejs's Module (Instruction below)

## Common setup

Approach code folder and run following commands in terminal.

```bash
cd code-folder
```

Install dependencies

```bash
npm install
```

## Steps for run servers

To start the express server, run the following

```bash
npm start
```

Open [http://localhost:7070](http://localhost:7070) and take a look around.


## Steps for import external database files

Step 1: Install the [MongoDB Compass]([https://www.npmjs.com/package/contentful-cli](https://www.mongodb.com/products/compass))

Step 2: Click the 'Connect' button to connect the localhost database server

Step 3: Create a new Database and name Database 'eBankingTDT' and name Collection 'users'

Step 4: Click to 'eBankingTDT' and click 'Create Collection' 3 time and name it in order 'transactions', 'images', 'creditcards'

Step 5: Access all the Collection and click 'ADD DATA', select 'Import File', select JSON in 'Select Input File Type', Select the file with the corresponded file's name and click 'Import'

Step 6: Do Step 5 with all 4 collections corresponded to 4 json files

Final Step: Open [http://localhost:7070/account](http://localhost:7070/account) and start sign in/sign out to explore the website
