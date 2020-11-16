import React, {useState} from 'react'
import styles from '../../fretboard.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStepBackward, faStepForward, faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'

const TabShuttle=(props)=>{

    
    const [clickTimer, setClickTimer] = useState()
    
    
       
    
    
    
    const handleMouseDown = (jump)=>{

        let inc = 1

        setClickTimer(setInterval(()=>{
            
            props.moveTab(jump*inc)
            
            if (inc<4) {
                inc=inc*2
            }
            
        }, 500))
       
    }


    const handleMouseUp=()=>{
        
        clearInterval(clickTimer)
        
        
    }

    return(<div className={styles.CenteredToolBar}>
        
        <div className={styles.ShuttleWrapper}>
        <FontAwesomeIcon className={styles.ToolBarIcon} icon={faStepBackward} onClick={()=>{props.toBeginning()}}/>
        <FontAwesomeIcon className={styles.ToolBarIcon} icon={faArrowCircleLeft} onClick={()=>{props.moveTab(-1)}} onMouseDown={()=>{handleMouseDown(-1)}} onMouseUp={handleMouseUp}/>
        <FontAwesomeIcon className={styles.ToolBarIcon} icon={faArrowCircleRight} onClick={()=>{props.moveTab(1)}} onMouseDown={()=>{handleMouseDown(1)}} onMouseUp={handleMouseUp}/>
        
        <FontAwesomeIcon className={styles.ToolBarIcon} icon={faStepForward} onClick={()=>{props.toEnd()}}/>
        </div>
        
    </div>)
}

export default TabShuttle