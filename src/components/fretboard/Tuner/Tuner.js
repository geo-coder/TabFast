import React from 'react'
import TunerInput from './TunerInput/TunerInput'

import styles from '../fretboard.module.css'


const tuner = (props) =>{

    let tunerInputList=[]
    for (let string=0;string<6;string++){
        tunerInputList.push(<TunerInput key={string} noteList={props.noteList} string={string} 
            tuning={props.tuning} changeTuning={props.changeTuning} />)
    }


    return(
        <div className={styles.Tuner}>
            

            {tunerInputList}
               



        </div>
    )
}

export default tuner