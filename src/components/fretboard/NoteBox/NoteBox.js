import React from 'react'
import styles from '../fretboard.module.css'


const noteBox=(props)=>{

    let classList=styles.NoteBox

    //make active if notebox's fretnumber matches num of playedNote
    if (props.fretNumber===props.playedNote) classList = [styles.NoteBox, styles.Active].join(' ')

    return(
    <div onClick={()=>{props.activateNote(props.fretNumber, props.string)}} className={classList}>
        <span>{props.note}</span>
    </div>
    )
}

export default noteBox