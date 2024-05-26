import { createContext, useState, useEffect } from "react";
import { Blocks } from 'react-loader-spinner'

const DataContext = createContext();

export const DataContextProvider = (props) => {
    const [pipeData, setPipeData] = useState([]);
    const [histogramData, setHistogramData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [density, setDensity] = useState();
    const [correlationGridData, setCorrelationGridData] = useState();
    const [minSlopeDirection, setMinSlopeDirection] = useState(null);
    const [stripPoints, setStripPoints] = useState({});
    const [loading, setLoading] = useState(true); // Add a loading state

    const setPipeDataHandler = (data) => {
        setPipeData(data);
    }

    const setSelectedOptionsHandler = (data) => {
      setSelectedOptions(data);
    }

    const setStripPointsHandler = (data) => {
      setStripPoints(data);
    }

    const setDensityHandler = (data) => {
      setDensity(data);
    }

    const setCorrelationGridDataHandler = (data) => {
      setCorrelationGridData(data);
    }

    const setMinSlopeDirectionHandler = (data) => {
      setMinSlopeDirection(data);
    }

    useEffect(() => {
      const fetchHistogramData = async () => {
        try {
          const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot.json');
          const jsonData = await response.json();
          //console.log(jsonData,'jsondata')

          setHistogramData(jsonData)

          fetchPipeData(); // Fetch pipe data after histogram data is processed

          // // Create a new web worker
          // const worker = new Worker(new URL('./dataWorker.js', import.meta.url));
          // const chunkSize = 1000; // Adjust chunk size as needed
  
          // worker.postMessage({ data: jsonData, chunkSize });
  
          // worker.onmessage = function(event) {
          //   const { chunkProcessed, chunk, complete } = event.data;
          //   if (chunkProcessed) {
          //     setHistogramData(prevData => [...prevData, ...chunk]);
          //   }
  
          //   if (complete) {
          //     console.log('All data processed');
          //     worker.terminate();
          //     fetchPipeData(); // Fetch pipe data after histogram data is processed
          //   }
          // };
  
          // worker.onerror = function(error) {
          //   console.error('Error in worker:', error);
          //   worker.terminate();
          //   setLoading(false); // Set loading to false in case of error
          // };
  
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); // Set loading to false in case of error
        }
      };
  
      const fetchPipeData = async () => {
        try {
          const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot_array.json');
          const jsonData = await response.json();
  
          const mappedData = [];
  
          jsonData.forEach(item => {
            const circumferenceValues = item["Circumference"].split(',');
  
            // If the Circumference contains a comma
            if (circumferenceValues.length > 1) {
              circumferenceValues.forEach(circumference => {
                const newItem = { ...item }; // Create a copy of the original object
  
                // Replace the Circumference value with the split value
                newItem["Circumference"] = circumference.trim(); // Remove leading/trailing spaces if any
  
                // Add the modified object to the mappedData array
                mappedData.push(newItem);
              });
            } else {
              // If no comma is found, simply add the original item to the mappedData array
              mappedData.push(item);
            }
          });
  
          const newMappedData = mappedData.map(item => ({
            pipeThickness: item["Thickness values"],
            pipeSectionId: item["Pipe Section"],
            circumferenceId: item["Circumference"],
            count: item["count"],
            countPercent: item["% Occurence"]
          }));
  
          setPipeData(newMappedData);
          setLoading(false); // Set loading to false after all data is processed
  
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); // Set loading to false in case of error
        }
      };
  
      fetchHistogramData();
    }, []);

  //   useEffect(() => {

  //   const fetchData = async () => {
  //       try {
  //         // const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot.json');
  //         const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot_array.json');
  //         //const response = await fetch('./pipeData.json');
  //         const jsonData = await response.json();
  //         //console.log('data',jsonData)
  //         //setPipeData(jsonData);

  //         const mappedData = [];

  //         jsonData.forEach(item => {
  //             const circumferenceValues = item["Circumference"].split(',');

  //             // If the Circumference contains a comma
  //             if (circumferenceValues.length > 1) {
  //                 circumferenceValues.forEach(circumference => {
  //                     const newItem = { ...item }; // Create a copy of the original object

  //                     // Replace the Circumference value with the split value
  //                     newItem["Circumference"] = circumference.trim(); // Remove leading/trailing spaces if any

  //                     // Add the modified object to the mappedData array
  //                     mappedData.push(newItem);
  //                 });
  //             } else {
  //                 // If no comma is found, simply add the original item to the mappedData array
  //                 mappedData.push(item);
  //             }
  //         });
          
  //         const newMappedData = mappedData.map(item => ({
  //           pipeThickness: item["Thickness values"],
  //           pipeSectionId: item["Pipe Section"],
  //           circumferenceId: item["Circumference"],
  //           count: item["count"],
  //           countPercent: item["% Occurence"]
  //         }));

  //         setPipeData(newMappedData);

  //         //console.log('new mapped data, splitting circumference IDS', newMappedData)
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     };

  // //   const fetchHistogramData = async () => {
  // //     try {
  // //     const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot.json');
  // //     const jsonData = await response.json();
    
  // //     setHistogramData(jsonData);

  // //     } catch (error) {
  // //       console.error('Error fetching data:', error);
  // //     }
  // // };

  // const fetchHistogramData = async () => {
  //   try {
  //     const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot.json');
  //     const jsonData = await response.json();

  //     // Create a new web worker
  //     const worker = new Worker(new URL('./dataWorker.js', import.meta.url));
  //     const chunkSize = 1000; // Adjust chunk size as needed

  //     worker.postMessage({ data: jsonData, chunkSize });

  //     worker.onmessage = function(event) {
  //       const { chunkProcessed, chunk, complete } = event.data;
  //       if (chunkProcessed) {
  //         setHistogramData(prevData => [...prevData, ...chunk]);
  //       }

  //       if (complete) {
  //         console.log('All data processed');
  //         worker.terminate();
  //       }
  //     };

  //     worker.onerror = function(error) {
  //       console.error('Error in worker:', error);
  //       worker.terminate();
  //     };

  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // fetchHistogramData();

  //     fetchData(); 
  //     //fetchHistogramData();

  //   }, []);

    // useEffect(() => {
    //   console.log(histogramData)
    // }, [histogramData])

    useEffect(() => {
      //On load of application, select all points on pipe that have thickness less than minimum acceptable threshold
      setSelectedOptions(['a'])
    }, [pipeData])

    const contextValue = {
        pipeData, 
        histogramData,
        setPipeDataHandler,
        selectedOptions,
        setSelectedOptionsHandler,
        stripPoints,
        setStripPointsHandler,
        density,
        setDensityHandler,
        correlationGridData,
        setCorrelationGridDataHandler,
        minSlopeDirection,
        setMinSlopeDirectionHandler
    }

if (loading) {
  return (
    <div className="spinner-container">
      <Blocks
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
    </div>
  );
}

return (
    <DataContext.Provider value={contextValue}>
        {props.children}
    </DataContext.Provider>
);
}

// export const DataProvider = ({ children }) => {
//     const [pipeData, setPipeData] = useState([]);

//     useEffect(() => {

//     const fetchData = async () => {
//         try {
//           const response = await fetch('./pipeData.json');
//           const jsonData = await response.json();
//           console.log('data',jsonData)
//           setPipeData(jsonData);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       };
  
//       fetchData();
  
//     //   fetch('').then(response => {
//     //     return response.json();
//     //   }).then(data => {
//     //     // Work with JSON data here
//     //     console.log('data.............',data);
//     //     setPipeData(prevData => ([...prevData, data]));
//     //   }).catch(err => {
//     //     // Do something for an error here
//     //     console.log("Error Reading data " + err);
//     //   });
      
//         }, []);
    
//         useEffect(() => {console.log('pipeData changed', pipeData)}, [pipeData])
//     return <DataContext.Provider value={pipeData}>{children}</DataContext.Provider>;
// };

export default DataContext;