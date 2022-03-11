## Getting Started

First, make sure you have Node.js installed, to check, run in a terminal:

```bash
node -v
```

If it is installed you will see some a number like 16.0.0 in the terminal, it must be at least version 14.
If nothing happened or you saw an error you must install Node.js on their website [nodejs.org](https://nodejs.org/en/), You should download the LTS version and follow the installation instructions.

Next, install mongodb following the guide on their [website](https://docs.mongodb.com/manual/administration/install-community/). If on windows, choose to install MongoDB as a service, it makes working with it a lot easier and during installation select to install compass, it is a gui that will help with visualizing and interacting with the database.

Once compass is installed, click connect to connect to the database (You can ignore the input). In the bottom left, click the plus icon to create the database. For the Database Name put `2022Scouting`, for the Collection Name put `standForms`. Ignore the other options and click "Create Database" at the bottom.

Next, you'll need a The Blue Alliance API Key, we use their API to obtain the match schedule for competitions. Go to [their website](https://www.thebluealliance.com/account/). If you see a page prompting you to log in, click the log in button and log in with a google account. Once you're on your account page you should see a section named "Read API Keys". In this section, input into the description input a name for the API key, something like YETI Scouting will do. Now copy the long string of letters and numbers that appear. Create a file in the project folder named `.env.local`. This file will never be committed to GitHub because your API Key should be kept private. The contents of the `.env.local` file should look like the following, where `<Your API Key>` is the string you copied from The Blue Alliance Account Page:

```
TBA_SECRET=<Your API Key>
```

Finally, you can now run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Now lets add some data to the database. The repository has two files meant for seeding the database, `standForms.json` and `teams.json`. They contain data that is used to test development features. In order to add them to your database, open compass and, on the left, open the 2022Scouting database and then the standForms collection you made earlier. Click add data and import file, find the repository and select `standForms.json`, then select JSON. Now click import at the bottom and wait for it to finish then click done. Now we'll need to create a new collection for the teams data. Hover over 2022Scouting on the left and click the plus icon. For the Collection Name, input: teams. Now click on the teams collection on the left and then click add data and import file, this time select the `teams.json` file from the repository and import it.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about React and Next.js, take a look at the following resources:

- [Learn React](https://beta.reactjs.org/learn) - An official tutorial that covers all the basics of React
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
