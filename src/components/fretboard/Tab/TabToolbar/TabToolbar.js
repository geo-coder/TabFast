import React from 'react'
import styles from '../../fretboard.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGuitar, faEraser,faCog, faPenSquare, faFileExport} from '@fortawesome/free-solid-svg-icons'

const toolBar=(props)=>{

    let insertChange=null
    let deleteButton=null
    if (props.tabLength>0) {
       insertChange=<div><FontAwesomeIcon className={styles.ToolBarIcon} icon={faPenSquare} onClick={props.editModeToggle} color={props.editMode==="insert"? "black" : "red"}/>
            {props.editMode==="insert" ? <p>Insert</p> : <p>Overwrite</p>}</div>
    
        deleteButton= <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faEraser} onClick={props.deleteTab} color='black'/>
            <p>Delete</p>
        </div>
    } else {
        insertChange=<div><FontAwesomeIcon className={styles.ToolBarIcon} icon={faPenSquare} color="gray"/>
           <p>Insert</p>
           </div>
        deleteButton= <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faEraser} color='gray'/>
            <p>Delete</p>
        </div>
           
    }


    return(<div className={styles.FlexToolBar}>
        
        <div className={styles.FullScreenHidden}>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faGuitar} onClick={()=>{props.changeView('fretBoard')}}/>
            <p>Fretboard</p>
        </div>
        
        <div className={styles.FullScreenHidden}>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faFileExport} onClick={()=>{props.changeView('tabDocument')}}/>
            <p>Export Doc</p>
        </div>
        

        
        
        
        <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faCog} onClick={props.modalToggle}/>
            <p>View Options</p>
        </div>

        

        {deleteButton}


        

        {insertChange}

        

    </div>)
}

export default toolBar