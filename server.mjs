import express from "express";
import cors from "cors";
import dialogflow from "@google-cloud/dialogflow";

const sessionClient = new dialogflow.SessionsClient(); // initialize sessionClient

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7001;

app.post("/talktochatbot", async (req, res) => { // post request to /talktochatbot
  const projectId = "ro-plant-w9by";  // projectId 
  const sessionId = req.body.sessionId || "session123"; // sessionId
  const query = req.body.text;
  const languageCode = "en-US";

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath( 
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };
  const responses = await sessionClient.detectIntent(request); 

  console.log("resp: ", responses[0].queryResult.fulfillmentText);

  res.send({
    text: responses[0].queryResult.fulfillmentText,
  });
});
app.get("/profile", (req, res) => {
  res.send("here is your profile");
});
app.get("/about", (req, res) => {
  res.send("some information about me");
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});