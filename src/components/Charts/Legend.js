import React, { useContext, useState } from 'react'
import { COLOURS, PIPE_CONSTANTS } from '../../utils/Contants.js';
import DataContext from '../../store/DataProvider.js';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Legend = (props) => {
    const pipeCtx = useContext(DataContext);

    const [checkedOptions, setCheckedOptions] = useState({ a: false, b: false, c: false, d: false })
    const [isReset, setIsReset] = useState(false);

    const handleChecked = ({ id, checked }) => {
        setCheckedOptions({ ...checkedOptions, [id]: checked })
    }

    React.useEffect(() => {
      const checkedTrueOptions = Object.entries(checkedOptions)
                                                .filter(([key, value]) => value === true)
                                                    .map(([key, value]) => key);

        pipeCtx.setSelectedOptionsHandler(checkedTrueOptions)
    }, [checkedOptions])

    React.useEffect(() => {
        if(pipeCtx?.selectedOptions?.length > 0) {
            setIsReset(false)
        } 
         else {
            setIsReset(true)
            props.onReset()
        }
      }, [pipeCtx?.selectedOptions])

      React.useEffect(() => {
        if(isReset || props.isReset) 
            setCheckedOptions(prev => ({ ...prev, a: false, b: false, c: false, d: false }));
      }, [isReset, props.isReset]);

      return (
        <div className='pipe-legend callout-container'>
           <div className="callout-arrow"></div>

            <span>{`Minimum Acceptable Threshold (MAT): ${PIPE_CONSTANTS.minAcceptableThreshold} mm`}</span>
     
            <div className="row" style={{ marginBottom: '-10px' }}>
                <FormGroup className="form-group col-md-6">
                    <FormControlLabel
                        label={`< MAT`}
                        control={<Checkbox id='a' checked={isReset ? !isReset : checkedOptions['a']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.red }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" />}
                        sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.black, fontSize: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', width: 'auto' } }}
                        onChange={(event) => handleChecked(event.target)}
                    />
                </FormGroup>
                <FormGroup className="form-group col-md-6">
                    <FormControlLabel
                        label={`> MAT to < 5% of MAT`}
                        control={<Checkbox id='b' checked={isReset ? !isReset : checkedOptions['b']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.amber }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" />}
                        sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.black, fontSize: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', width: 'auto', marginRight: '20px' } }}
                        onChange={(event) => handleChecked(event.target)} 
                    />
                </FormGroup>
            </div>
    
            <div className="row">
                <FormGroup className="form-group col-md-6">
                    <FormControlLabel
                        label={`> 5% of MAT to 10% of MAT`}
                        control={<Checkbox id='c' checked={isReset ? !isReset : checkedOptions['c']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.yellow }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" />}
                        sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.black, fontSize: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', width: 'auto' } }}
                        onChange={(event) => handleChecked(event.target)}
                    />
                </FormGroup>
                <FormGroup className="form-group col-md-6">
                    {/* <FormControlLabel
                        label={`> 10% of MAT`}
                        control={<Checkbox id='d' checked={isReset ? !isReset : checkedOptions['d']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.green }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" />}
                        sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.black, fontSize: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', width: 'auto' } }}
                        onChange={(event) => handleChecked(event.target)}
                    /> */}
                </FormGroup>
            </div>
        </div>
    )
  }

export default Legend
