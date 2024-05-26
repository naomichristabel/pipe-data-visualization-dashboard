import React from 'react'
import ConfigBox from './ConfigBox'

const Configuration = () => {
    const configBoxData = {
        pipeName: {
            icon: <img src="../../pipe-data-visualization-dashboard/assets/icons/pipe.png" width="50" height="50" alt="Pipe"/>,
            title: 'Pipe Name',
            content: '10-PF-G2-332001'
        },
        fileName: {
            icon: <img src="../../pipe-data-visualization-dashboard/assets/icons/file.PNG" width="50" height="50" alt="Pipe"/>,
            title: 'File Name',
            content: '332001.json'
        },
        pipeDiameter: {
            icon: <img src="../../pipe-data-visualization-dashboard/assets/icons/diameter.PNG" width="50" height="50" alt="Pipe"/>,
            title: <>Pipe Diameter<br/><br/></>,
            content: '10 inch'
        },
        minAccThreshold: {
            icon: <img src="../../pipe-data-visualization-dashboard/assets/icons/threshold.PNG" width="50" height="50" alt="Pipe"/>,
            title: 'Acceptable Minimum Thickness Threshold',
            content: '18.96 mm'
        }
    };

  return (
    <div style={{ width: "98%" }}>
        <div className='row justify-content-between mb-5 flex-nowrap'>
            <div className='card col-md-6 me-1 p-3'><ConfigBox icon={configBoxData.pipeName.icon} title={configBoxData.pipeName.title} content={configBoxData.pipeName.content} /></div>
            <div className='card col-md-6 p-3'><ConfigBox icon={configBoxData.fileName.icon} title={configBoxData.fileName.title} content={configBoxData.fileName.content} /></div>
        </div>
        <div className='row justify-content-between mb-3 flex-nowrap'>
            <div className='card col-md-6 me-1 p-3'><ConfigBox icon={configBoxData.pipeDiameter.icon} title={configBoxData.pipeDiameter.title} content={configBoxData.pipeDiameter.content} /></div>
            <div className='card col-md-6 p-3'><ConfigBox icon={configBoxData.minAccThreshold.icon} title={configBoxData.minAccThreshold.title} content={configBoxData.minAccThreshold.content} /></div>
        </div>
      
    </div>
  )
}

export default Configuration
