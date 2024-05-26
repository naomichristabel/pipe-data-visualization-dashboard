import React, { useEffect, useState } from 'react'
import DataContext from '../../store/DataProvider.js';
import "bootstrap-icons/font/bootstrap-icons.css"
import { COLOURS } from '../../utils/Contants'

const IconsContainer = (props) => {
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    
    const pipeCtx = React.useContext(DataContext)

    const handleOpenInfo = () => {
        props.onOpenInfo();
    }

    const handleTogglePlanes = () => {
        props.onToggle()
    }

    const handleDeselectAll = () => {
        pipeCtx.setSelectedOptionsHandler([]);
      };

    const handleReset = () => {
        props.onReset(true);
    }

    const handleShowCheckboxes = () => {
        setShowCheckboxes(prevShowCheckbox => !prevShowCheckbox)
    }

    useEffect( ()=>{
        //console.log('show / hide', showCheckboxes)
        props.toggleCheckboxesHandler(showCheckboxes);
    },[showCheckboxes])

    useEffect(() => {
        if (props?.isReset) {
          handleDeselectAll();
        }
      }, [props?.isReset]);

  return (
    <div className="icons-container row" style={{color: COLOURS.white, width: '500px', marginRight: '-20%', marginBottom: '5px' }}>
        {/* <div className='col-md-2 single-icon'>
            <img src="./assets/icons/reduce-white.png" width={32} height={32} alt="Strongest Decline Icon" />
        </div> */}
        <div className='col-md-2 single-icon' onClick={handleTogglePlanes}>
            <img src="./assets/icons/planes.svg" width={32} height={32} alt="Planes Icon" />
        </div>
        <div className='col-md-2 single-icon' onClick={handleOpenInfo}>
            <i className="bi bi-info-circle h4"></i>
        </div>
        <div className='col-md-2 single-icon' onClick={handleShowCheckboxes}>
            <i className="bi bi-stack h4"></i>
        </div>
        <div className='col-md-2 single-icon' onClick={handleReset}>
            <i className="bi bi-arrow-counterclockwise h4"></i>
        </div>
    </div>
  )
}

export default IconsContainer
