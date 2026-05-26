import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/api/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    console.log("USER MESSAGE:", userMessage);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    // SAFE RESPONSE EXTRACTION
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if(reply){
      res.json({ reply });
    } else {

      res.json({
        reply: "Gemini returned empty response."
      });

    }

  } catch(error){

    console.log("SERVER ERROR:");
    console.log(error);

    res.status(500).json({
      reply: "Server crashed."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
