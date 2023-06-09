import { useState } from "react";
import React from "react";
import "./App.css";
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

function App() {
  const [dino, setDino] = useState("🦕");
  const [dinoName, setDinoName] = useState("Sauropod");
  const [dinoPrompt, setDinoPrompt] = useState(
    "Answer creatively like a brontosaurus, maybe add herbivore sounds (do not roar):"
  );
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");

  function toggleDino() {
    setReply("");
    if (dino === "🦖") {
      setDino("🦕");
      setDinoName("Sauropod");
      setDinoPrompt(
        "Answer creatively like a brontosaurus, maybe add herbivore sounds (do not roar):"
      );
    } else {
      setDino("🦖");
      setDinoName("T-rex");
      setDinoPrompt(
        "Answer creatively like a t-rex (you can roar, but say more than just that):"
      );
    }
  }

  function getReply() {
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `${dinoPrompt} ${prompt}`,
        max_tokens: 100,
        temperature: 0,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let dataReply = data.choices[0].text;
        if (dataReply[0] === "?") dataReply = dataReply.slice(1);
        setReply(dataReply);
      })
      .catch((error) => console.error(error));
  }

  function onKeyDown(event) {
    if (event.key === "Enter") getReply();
  }

  return (
    <div className="push-footer">
      <main className="App">
        <h1>Dino OpenAI</h1>
        <p className="intro-p">Get a dino answer to any question!</p>
        <input
          placeholder="What is the rain like in Spain?"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
        ></input>
        <button onClick={getReply}>Ask the {dinoName}</button>
        <span onClick={toggleDino} className="dino">
          {dino}
        </span>
        <p className="reply">"{reply}"</p>
      </main>
      <footer>
        Made by{" "}
        <a href="https://github.com/ktpeace" target="_blank" rel="noreferrer">
          Kat
        </a>
      </footer>
    </div>
  );
}

export default App;
