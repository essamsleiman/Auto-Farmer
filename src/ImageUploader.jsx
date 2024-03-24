import React from "react";

function ImageUploader({ onImageUpload }) {
  // Handle file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let fileReader = new FileReader();

      fileReader.onloadend = function (e) {
        const content = e.target.result;
        // content contains the base64-encoded string
        // Assuming onImageUpload can handle base64 encoded images directly
        onImageUpload(content); // Pass the base64 string to the handler
      };

      fileReader.readAsDataURL(e.target.files[0]);

      // let img = e.target.files[0];
      // console.log("img: ", img);
      // const imageURL = URL.createObjectURL(img);
      // console.log("URL: :", imageURL);
      // onImageUpload(imageURL); // Call the handler passed via props
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
    </div>
  );
}

export default ImageUploader;
