# YETI Robotics Scouting

## Getting Started

First, make sure you have Node.js installed, to check, run in a terminal (Click "Terminal" in the top left corner, and then "New Terminal"):

```bash
node -v
```

If it is installed you will see some a number like 18.0.0 in the terminal, it must be at least version 14.
If nothing happened or you saw an error you must install Node.js on their website [nodejs.org](https://nodejs.org/en/), You should download the LTS version and follow the installation instructions.

Next, install mongodb following the guide on their [website](https://docs.mongodb.com/manual/administration/install-community/). If on windows, choose to install MongoDB as a service, it makes working with it a lot easier and during installation select to install compass, it is a gui that will help with visualizing and interacting with the database.

Once compass is installed, click connect to connect to the database (You can ignore the input). In the left hand column to the right of the Database heading, click the plus icon to create the database. For the Database Name put `2022Scouting`, for the Collection Name put `standForms`. Ignore the other options and click "Create Database" at the bottom.

Next, you'll need a The Blue Alliance API Key, we use their API to obtain the match schedule for competitions. Go to [their website](https://www.thebluealliance.com/account/). If you see a page prompting you to log in, click the log in button and log in with a google account. Once you're on your account page, scroll down, you should see a section named "Read API Keys". In this section, input into the description input a name for the API key, something like "YETI Scouting" will do. Now copy the long string of letters and numbers that appear. Create a file in the project folder named `.env.local`. Don't worry, this file will never be committed to GitHub because your API Key should be kept private. The contents of the `.env.local` file should look like the following, where `<Your API Key>` is the string you copied from The Blue Alliance Account Page:

```
TBA_SECRET=<Your API Key>
```

Ensure pnpm is installed, run in a terminal:

```bash
pnpm -v
```

If pnpm is not installed, follow the installation directions found [here](https://pnpm.io/installation).

Install dependencies via:

```bash
pnpm i
```

Finally, you can now run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) by holding control and clicking to see the result.

Now lets add some data to the database. The repository has three files meant for seeding the database, `test-data/out/standforms.json` and `test-data/out/teams.json` and `test-data/out/users.json`. They contain data that is used to test development features. In order to add them to your database, open compass and, on the left, open the 2022Scouting database and then the standForms collection you made earlier. Click import file in the green box on the middle of your screen, find the repository and select `standForms.json`. Now click import at the bottom of the pop-up box. Now we'll need to create a new collection for the teams data. Find the 2022Scouting heading and click the plus icon to the left. For the Collection Name, input: "teams". Now click on the teams collection on the left and then click add data and import file, this time select the `teams.json` file from the repository and import it. Find the 2022Scouting heading and click the plus icon to the left. For the Collection Name, input: "users". Now click on the teams collection on the left and then click add data and import file, this time select the `users.json` file from the repository and import it. In total, you should have 3 different Collections (headings) under the 2022Scouting database.


[Learn about API routes, you don't have to do anything](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about React and Next.js, take a look at the following resources:

- [Learn React](https://beta.reactjs.org/learn) - An official tutorial that covers all the basics of React
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive follow along Next.js tutorial.
