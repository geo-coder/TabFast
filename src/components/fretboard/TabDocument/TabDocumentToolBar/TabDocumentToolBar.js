import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGuitar, faNewspaper, faCog } from '@fortawesome/free-solid-svg-icons'
import styles from '../../fretboard.module.css'


const TabDocumentToolBar = (props) => {


    return(<div className={styles.FlexToolBar}>
        
        <div className={styles.FullScreenHidden}>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faGuitar} onClick={()=>{props.changeView('fretBoard')}}/>
            <p>Fretboard</p>
        </div>

        <div className={styles.FullScreenHidden}>
            <FontAwesomeIcon className={styles.MobileToolBarIcon} icon={faNewspaper} onClick={()=>{props.changeView('tab')}}/>
            <p>Tab Editor</p>
        </div>

        <div>
            <FontAwesomeIcon className={styles.ToolBarIcon} icon={faCog} onClick={props.optionModalOpen}/>
            <p>Doc Options</p>
        </div>

        </div>)
}
export default TabDocumentToolBar