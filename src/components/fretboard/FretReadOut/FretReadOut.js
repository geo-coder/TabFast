import React from 'react'
import styles from '../fretboard.module.css'
import Select from '../UI/Select/Select'

const FretReadOut=(props)=>{

    let dispList=['-', '/', '\\', '|']

    for (let i=0; i<23; i++) dispList.push(i)


    let selectData=dispList.map(item=>({value:item, display:item}))

    
    let inputList=props.playedNotes.map((item, index)=>
        <div key={'FretBoardInput'+index} className={styles.NoteWrapper}>
        <Select value={item}  optionsList={selectData} changeHandle={(e)=>{props.playedNoteChange(e.target.value, index)}} string={index} />
        </div>
    )


    return(
        <div className={styles.Tuner}>
              {inputList}
          </div>        
        )
}
export default FretReadOut