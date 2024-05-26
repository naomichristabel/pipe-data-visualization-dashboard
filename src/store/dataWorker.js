// dataWorker.js

onmessage = function(event) {
    const { data, chunkSize } = event.data;
  
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      // Simulate some processing
      const processedChunk = chunk.map(item => item); // Replace this with actual processing logic
  
      // Post the processed chunk back to the main thread
      postMessage({ chunkProcessed: true, chunk: processedChunk });
    }
  
    postMessage({ complete: true });
  };
  