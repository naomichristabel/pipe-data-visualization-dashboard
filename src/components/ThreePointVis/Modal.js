import React from 'react';
import Info from './Info';
import { COLOURS } from '../../utils/Contants';

const Modal = ({ isOpen, onClose }) => {

    const modalIcons = {
        rotate: {
            icon: <img src="./assets/icons/360-rotate.svg" width={40} height={40} alt="Rotate Icon" style={{ filter: 'invert(100%)'}}/>,
            title: 'Orbit',
            content: <span>Right click + drag <br/> or Two-finger drag (touch)</span>
        },
        zoom: {
            icon: <i className="bi bi-zoom-in h2"></i>,
            title: 'Zoom',
            content: <span>Mouse wheel / scroll <br/> or Pinch (touch)</span>
        },
        pan: {
            icon: <i className="bi bi-arrows-move h2"></i>,
            title: 'Pan',
            content: <span>Left click + drag <br/> or One-finger drag (touch)'</span>
        },
    }

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onClose}>
                X
            </button>
            
            <div className='row modal-text' style={{ margin: 'auto' }}>
                <div className='col-md-4 p-5'><Info icon={modalIcons.pan.icon} title={modalIcons.pan.title} content={modalIcons.pan.content}/></div>
                <div className='col-md-4 p-5'><Info icon={modalIcons.zoom.icon} title={modalIcons.zoom.title} content={modalIcons.zoom.content}/></div>
                <div className='col-md-4 p-5'><Info icon={modalIcons.rotate.icon} title={modalIcons.rotate.title} content={modalIcons.rotate.content}/></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

