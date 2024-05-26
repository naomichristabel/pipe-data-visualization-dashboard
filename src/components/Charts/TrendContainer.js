import React, { useEffect, useState } from 'react'
import TrendPlot from './TrendPlot.js'
import { LABEL, YEARS } from '../../utils/Contants.js'

const TrendContainer = ({ title }) => {
  const [selectedYear, setSelectedYear] = useState('')

  return (
    <>
    <div className="container text-center" style={{ marginTop: '30px' }}>

    {(title === LABEL.trendTabs.current) && <h6>{YEARS[title.toLowerCase()]}</h6>}

    {(title !== LABEL.trendTabs.current) &&
      <select onChange={e => setSelectedYear(e.target.value)}>
        { YEARS[title.toLowerCase()]?.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        )) }
      </select>
    }

    {(title === LABEL.trendTabs.current) &&
      <>
        <div className="row">
          {/* <div className="col">
            <LinePlot direction={LABEL.direction.n} pipeThicknessValues={[18.7, 19.1, 18.6, 18.8, 18.9, 19.5]} pipeSections={[1, 2, 3, 4, 5, 6]} />
          </div> */}
           <div className="col">
            <TrendPlot direction={LABEL.direction.n} />
          </div>
          <div className="col">
            <TrendPlot direction={LABEL.direction.s} />
          </div>
        </div>

        <div className="row my-5">
        <div className="col">
            <TrendPlot direction={LABEL.direction.e} />
          </div>
          <div className="col">
            <TrendPlot direction={LABEL.direction.w} />
          </div>
        </div>
      </>
    }

    {(title === LABEL.trendTabs.upcoming) &&
      <div className="row" style={{ height: '200px', textAlign: 'center'}}>
        
      </div>
    }
      </div>
    </>
  )
}

export default TrendContainer
