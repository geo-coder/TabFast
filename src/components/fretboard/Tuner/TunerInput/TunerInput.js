import React from 'react'
import styles from '../../fretboard.module.css'



const tunerInput = (props) =>{


    //list of all 12 notes in the tuning select
    let optionList = props.noteList.map(item => <option key={item} value={item}>{item}</option>)

    const handleChange =(e)=>{ 
        props.changeTuning(props.string, e.target.value) //runs changeTuning func in fretboard.js
    }

    return(
        
               
        
            <div className={styles.NoteWrapper}>
               <select value={props.tuning[props.string]} onChange={handleChange}>
                    
                    {optionList}
                  
                
                </select>
                
            </div>
           
            
        
    )
}

export default tunerInput