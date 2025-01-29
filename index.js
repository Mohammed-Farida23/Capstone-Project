const express = require("express");
const axios = require("axios");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", { joke: null, name: "" });
});

app.get("/get-joke", async (req, res) => {
    const name = req.query.name || "Guest";
    const category = req.query.category || "Any"; // ✅ Fix: Now inside the route
    const type = "twopart";

    try {
        const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}?type=${type}`);
        const jokeData = response.data;

        let jokeText = "";
        if (jokeData.type === "single") {
            jokeText = jokeData.joke;
        } else {
            jokeText = `${jokeData.setup} ... ${jokeData.delivery}`;
        }

        res.render("index", { joke: jokeText, name });
    } catch (error) {
        res.render("index", { joke: "Oops! Could not fetch a joke.", name });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
