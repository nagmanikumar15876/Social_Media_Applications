export const uploadToCloudinary = async (pics , fileType) => {
    if (pics) {
      
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "twitnagmani");
      data.append("cloud_name", "daa3zjjvi");
 
      const res = await fetch(`https://api.cloudinary.com/v1_1/daa3zjjvi/${fileType}/upload`, {
        method: "post",
        body: data,
      })
        
        const fileData=await res.json();
        console.log("url : ", fileData.url.toString());
        return fileData.url.toString();
  
    } else {
      console.log("error FROM upload to cloudinary ");
    }
  };

