const { pipeline } = require("@xenova/transformers");

let classifier = null;

// Load model once
const getClassifier = async () => {
  if (!classifier) {
    console.log("Loading AI image classifier...");
    
    classifier = await pipeline(
      "image-classification",
      "Xenova/vit-base-patch16-224"
    );

    console.log("AI model loaded");
  }

  return classifier;
};

exports.generateTags = async (imageUrl) => {
  try {
    const model = await getClassifier();

    const result = await model(imageUrl);

    const tags = result
      .slice(0, 5)
      .map((item) =>
        item.label.toLowerCase()
      );

    console.log("AI Tags:", tags);

    return tags;
  } catch (error) {
    console.log(
      "AI tagging failed:",
      error.message
    );

    return [];
  }
};