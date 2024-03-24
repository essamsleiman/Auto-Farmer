import { useState, useEffect } from "react";
import "./App.css";
import lens from "./assets/lens.png";
import loadingGif from "./assets/loading.gif";
import OpenAI from "openai";
import ImageUploader from "./ImageUploader";
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
});

function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(undefined);

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer(undefined);
    }
  }, [prompt]);

  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (image) => {
    // console.log("Image in App component:", image);
    // console.log("Base64 Encoded Image:", image);

    setUploadedImage(image);
    // Now the uploadedImage state in App component holds the selected image
    // You can pass this image to other components or use it as needed
  };

  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);

      // const requestOptions = {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt }),
      // };

      // const res = await fetch("/api/ask", requestOptions);

      // console.log(res.choices[0]);
      // console.log("uploadedImage: ", uploadedImage);
      // console.log(uploadedImage);
      // console.log(`data:image/jpeg;base64,${uploadedImage}`);
      const res = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: uploadedImage,
                },
              },
            ],
          },
        ],
      });

      // console.log("prompt: ", prompt);
      // const res = await openai.chat.completions.create({
      //   model: "gpt-4-vision-preview",
      //   messages: [
      //     {
      //       role: "user",
      //       content: [
      //         {
      //           type: "text",
      //           text: prompt,
      //         },
      //         {
      //           type: "image_url",
      //           image_url: {
      //             // url: `data:image/jpeg;base64,${uploadedImage}`,
      //             url: uploadedImage,
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // });
      console.log("RESSSSSS: ", res.choices[0]);

      console.log("res: ", res.choices[0].message.content);
      // if (!res.ok) {
      //   throw new Error("Something went wrong");
      // }

      // const { message } = await res.json();
      setAnswer(res.choices[0].message.content);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Auto-Farmer 🧑‍🌾</h1>
      </header>
      <div className="app-container">
        <div className="spotlight__wrapper">
          <input
            type="text"
            className="spotlight__input"
            placeholder="Ask me anything..."
            disabled={loading}
            style={{
              backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
            }}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
          />
          <div className="spotlight__answer">{answer && <p>{answer}</p>}</div>
          <ImageUploader onImageUpload={handleImageUpload} />
          {uploadedImage && (
            <div>
              <h4>Image Preview</h4>
              <img
                src={uploadedImage}
                alt="Preview"
                style={{ width: "200px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
