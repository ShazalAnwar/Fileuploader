import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);


  const getFiles=async()=>{
    return await  axios.get('http://localhost:3001/show')
  }

  const {data,isLoading} =useQuery({
    queryKey: ['images'],
    queryFn: () =>
    getFiles(),
    
  })
  const queryClient = useQueryClient()

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };



  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Replace 'YOUR_UPLOAD_API_ENDPOINT' with your actual API endpoint
      await axios.post('http://localhost:3001/upload', formData);

      console.log('File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['images'] })
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };
if(isLoading){
  return <div>Loading...</div>
}
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div>
        {
          data?.data?.length && data.data.map((file)=><img src={file.url} height={200} width={200} alt='reter'/>)
        }
      </div>
    </div>
    
  );
};

export default App;
