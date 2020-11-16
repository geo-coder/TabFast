import React from 'react'
import styles from '../fretboard.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faAngleDoubleRight, faNewspaper, faMusic, faCog } from '@fortawesome/free-solid-svg-icons'

const toolBar=(props)=>{



    return(<div className={styles.FlexToolBar}>
        
        <div className={styles.FullScreenHidden}>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faNewspaper} onClick={()=>{props.changeView('tab')}}/>
            <p>Tab Editor</p>
        </div>

        <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faCog} onClick={props.toggleFretBoardModal}/>
            <p>Tuner</p>
        </div>

        <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faMusic} onClick={props.playNotes}/>
            <p>Play Notes</p>
        </div>
        
        <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faEraser} onClick={props.clearBoard}/>
            <p>Clear Board</p>
        </div>
        
        <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faAngleDoubleRight} onClick={props.addTab}/>
            <p>Add Tab</p>
        </div>
        
    </div>)
}

export default toolBar