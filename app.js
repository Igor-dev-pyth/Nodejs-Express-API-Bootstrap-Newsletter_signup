const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing")

const app = express();

// app.use(bodyParser.urlencoded({extended:true})); PACKAGE DEPRECATED
app.use(express.urlencoded({
  extended: true
})); //Parse URL-encoded bodies
app.use(express.static("public")); //To use static files from local machine on a server
app.use(express.json());

mailchimp.setConfig({
  apiKey: "YOUR_API_KEY",
  server: "YOUR_SERVER"
});

// async function run() {
//   const response = await mailchimp.ping.get();
//   console.log(response);
// }
//
// run();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {

  console.log(req.body.fName);
  console.log(req.body.lName);
  console.log(req.body.email);

  const listId = "YOUR_LIST_ID";
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });

      console.log("Successfully added contact as an audience member. The contact's id is ${response.id}.");
      res.sendFile(__dirname + "/success.html")
    }
    catch (e) {
      res.sendFile(__dirname + "/failure.html")
    }
  }
  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("server runs on port 3000");
});
