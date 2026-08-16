// export const uploadToCloudinary = async (pics , fileType) => {
//     if (pics) {
      
//       const data = new FormData();
//       data.append("file", pics);
//       data.append("upload_preset", "twitnagmani");
//       data.append("cloud_name", "daa3zjjvi");
 
//       const res = await fetch(`https://api.cloudinary.com/v1_1/daa3zjjvi/${fileType}/upload`, {
//         method: "post",
//         body: data,
//       })
        
//         const fileData=await res.json();
//         console.log("url : ", fileData.url.toString());
//         return fileData.url.toString();
  
//     } else {
//       console.log("error FROM upload to cloudinary ");
//     }
//   };

export const uploadToCloudinary = async (pics, fileType = "auto") => {
    if (pics) {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "twitnagmani");
        data.append("cloud_name", "daa3zjjvi");

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/daa3zjjvi/${fileType}/upload`, {
                method: "post",
                body: data,
            });

            const fileData = await res.json();
            
            // If Cloudinary throws an error, print it to the console!
            if (fileData.error) {
                console.error("CLOUDINARY REJECTED THE FILE:", fileData.error.message);
                alert(`Upload failed: ${fileData.error.message}`);
                return null;
            }

            console.log("url : ", fileData.secure_url || fileData.url);
            
            // Secure URLs (https) are required for PDFs to open correctly in modern browsers
            return fileData.secure_url || fileData.url.toString();

        } catch (error) {
            console.error("Network Error during upload:", error);
            return null;
        }
    } else {
        console.log("error FROM upload to cloudinary: No file provided");
        return null;
    }
};