TDT eBanking Web App

Working on Project in Advanced Website Development

A simple eBanking system for TDT Student
having basic functionality of simple eBanking Web App
Stick to project description

Requirements:
Nodejs (version 16.15 .00 or above)
MongoDB Community Server (Version 5.0.8 or above)
Required Nodejs's Module (Instruction below)

Common setup
Approach code folder and run following commands in terminal.

'cd code-folder'

Install dependencies:

'npm install'

Steps for run servers:

To start the express server, run the following:

npm start

Open http://localhost:7070 and take a look around.

Steps for import external database files:

Step 1: Install the MongoDB Compass

Step 2: Click the 'Connect' button to connect the localhost database server 
Step 3: Create a new Database and name Database 'eBankingTDT' and name Collection 'users' 
Step 4: Click to 'eBankingTDT' and click 'Create Collection' 3 time and name it in order 'transactions', 'images', 'creditcards' 
Step 5: Access all the Collection and click 'ADD DATA', select 'Import File', select JSON in 'Select Input File Type', Select the file with the corresponded file's name and click 'Import'
Step 6: Do Step 5 with all 4 collections corresponded to 4 json files
Final Step: Open http://localhost:7070/account and start sign in/sign out to explore the website

ACCOUNT INFORMATION:

Admin Account:
username: 1234567890
password: Fl@son1511

Active Account:
username: 1440659877
password: Fl@son1511

Blocked Account:
username: 1294565361
password: Fl@son1511

New Account:
username: 1036637150
password: Fl@son1511