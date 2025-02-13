import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { list } from "aws-amplify/storage";

function Graph({ bucket_folder, set_width }) {
  const [latestImage, setLatestImage] = useState(null); // Store the latest image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);
  useEffect(() => {
    // Function to list files from the S3 bucket
    const fetchFiles = async () => {
      try {
        const result = await list({
          path: `private/${bucket_folder}/`,
          level: "private",
        });
        console.log(result);

        const allFiles = result["items"]; // Get all files from the result
        console.log(allFiles);

        console.log(allFiles["lastModified"]);

        const sortedFiles = allFiles.sort(
          (a, b) => b.lastModified - a.lastModified
        );

        console.log("Sorted", sortedFiles);

        // const latestImageFile = sortedFiles.find(file => file.key.match(/\.(jpg|jpeg|png|gif)$/i));

        setLatestImage(sortedFiles[0]); // Set the latest image to the first file in the sorted array
      } catch (err) {
        setError("Error fetching files: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles(); // Call the listFiles function
  }, []); // Empty dependency array means it runs once when the component mounts

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {imageError ? (
        <p>{imageError}</p> // Display image-specific error message
      ) : latestImage ? (
        <div>
          <img
            src={`https://wildlife-graph-data-bucket260d7-dev.s3.us-east-1.amazonaws.com/${latestImage.path}`}
            alt={latestImage.key}
            style={{ width: `${set_width}`, height: "auto" }}
            onError={() =>
              setImageError(
                "Error loading the image. Please check the URL or permissions."
              )
            }
          />
        </div>
      ) : (
        <p>No image found</p>
      )}
    </div>
  );
}

export default Graph;
