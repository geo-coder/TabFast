import React from 'react'
import NoteBox from '../NoteBox/NoteBox'
import styles from '../fretboard.module.css'



const fret = (props) =>{


    let noteBoxList=[]
    
    //function finds the note in alpha form based on the string and fret number
    const getNote=(string)=>{

        let openNote=props.tuning[string]
        let pointer=props.noteList.findIndex(item => item===openNote)
        for (let counter=0;counter<props.fretNumber;counter++){
            
            pointer=pointer+1
            if (pointer===props.noteList.length) pointer=0
        }
        return props.noteList[pointer]
    }
    
    

    for (let string=0; string<6; string++){

        let note=getNote(string)
        noteBoxList.push(
                <div key={'fret'+props.fretNumber+'string'+string} className={styles.NoteWrapper}>
                    <NoteBox 
                        string={string}
                        playedNote={props.playedNotes[string]} 
                        fretNumber={props.fretNumber} 
                        note={note}
                        activateNote={props.activateNote}
                        />
                </div>)


    }

    let fretDot=null

    if ([3,5,7,9,15,17,19,21].includes(props.fretNumber)) fretDot=<span className={styles.dot}></span>
    if (props.fretNumber===12) fretDot=<div><span className={styles.twodotA}></span><span className={styles.twodotB}></span></div>

    return(
        
               
        
            <div className={props.fretNumber===0 ? styles.ZeroFret :  styles.Fret}>
               
               
                
                <p className={styles.NumDisplay}>{props.fretNumber}</p>
                
               
               <div className={styles.NoteBoxContainer}>
                    {noteBoxList}

                </div>

                
                {fretDot}

                
            </div>
           
            
        
    )
}

export default fret