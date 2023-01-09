let express = require("express");
let cors = require("cors");
let axios = require("axios");
const { Client } = require("pg");

let app = express();
app.use(cors());

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested=With,X-Auth-Token, Content-Type, Accept"
  );
  next();
});

const client = new Client({
  host: "db.zfvevyepvcwchyrptebo.supabase.co",
  user: "postgres",
    password: "Vaibhav@123",
    database: "postgres",
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

let port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let baseURL = "https://vaibhavrawat1.atlassian.net";

app.get("/ticketapp", async (req, res) => {
  axios
    .get(baseURL + "/rest/api/3/search", {
      auth: {
        username: "vaibhavrawat8888@gmail.com",
        password: "eB769uuAh4aTudYscOtf0B03",
      },
    })
    .then((response) => {
      res.send(response.data);
      let jiraIssue = response.data.issues.map((obj) => {
        return {
          number: obj.id,
          name: obj.key,
          description: obj.fields.issuetype.description,
          reporter:obj.fields.reporter.displayName,
          status: obj.fields.parent.fields.status.name,
          duedate:obj.fields.duedate
        };
      });
      
      console.log(response.data);
      const query = `INSERT INTO Ticketapp (number , name , description , reporter , status , duedate) VALUES ($1,$2,$3,$4,$5,$6)`;
      client.query(query, jiraIssue, function (err, result) {
        if (err) {
          res.status(400).send(err);
        }
        res.send("insertion successful");
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
});

// app.get("/ticketapp", function (req, res, next) {
//   const query = "select * from Ticketapp";
//   client.query(query, function (err, result) {
//     if (err) {
//       res.status(400).send(err);
//     }
//     res.send(result.rows);
//   });
// });

// app.post("/ticketapp", function (req, res, next) {
//   var values = Object.values(req.body);
//   console.log(values);
//   const query = `INSERT INTO Ticketapp (number , name , description , reporter , status , duedate) VALUES ($1,$2,$3,$4,$5,$6)`;
//   client.query(query, values, function (err, result) {
//     if (err) {
//       res.status(400).send(err);
//     }
//     res.send("insertion successful");
//   });
// });
