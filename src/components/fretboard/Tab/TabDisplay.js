import React, { useState } from 'react'
import TabToolbar from './TabToolbar/TabToolbar'
import TabTextCursor from './TabTextCursor/TabTextCursor'
import TabShuttle from './TabShuttle/TabShuttle'
import TabInputs from './TabInputs/TabInputs'
import styles from '../fretboard.module.css'
import Modal from '../UI/Modal/Modal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUndo, faRedo} from '@fortawesome/free-solid-svg-icons'
import twitter from '../../../assets/Twitter.png'
import github from '../../../assets/GitHub.png'

const TabDisplay = (props) =>{

    

    const [showModal, setShowModal] = useState(false)
    const [showAbout, setShowAbout] = useState(false)
    
    
    const [deleteConfirm, setDeleteConfirm] = useState(false)



    const modalToggle = () => {
        
        setShowModal(!showModal)
    }


    const toggleAbout = () =>{
        setShowAbout(!showAbout)
    }

    const deleteAll =() =>{
        props.deleteAll()
        setDeleteConfirm(false)
        modalToggle()
    }


    
    
    //setup undo and redo buttons, style based on whether they are active or not
    let redo = <FontAwesomeIcon style={{color:'rgba(0, 0, 0, 0.267)'}} className={styles.ToolBarIcon} icon={faRedo}/>
    let undo = <FontAwesomeIcon style={{color:'rgba(0, 0, 0, 0.267)'}} className={styles.ToolBarIcon} icon={faUndo}/>
    
    if (props.isRedo){
        redo=<FontAwesomeIcon className={styles.ToolBarIcon} icon={faRedo} onClick={props.redo}/>

    } 
    

    if (props.isUndo){
        undo=<FontAwesomeIcon className={styles.ToolBarIcon} icon={faUndo} onClick={props.undo}/>

    } 
    





    return(<div className={styles.TabDisplayMobile}>
        <TabToolbar 
            changeView={props.changeView}
            deleteTab={props.deleteTab}
            toggleBackdrop={props.toggleBackdrop}
            modalToggle={modalToggle}
            editMode={props.editMode}
            editModeToggle={props.editModeToggle}
            tabLength={props.tab.length}
        
        />
      

        <Modal show={showModal}>
        
           
           {!deleteConfirm? <div>
                <h2>Tab Display Options</h2>
            
                
                <p>Viewer length: <span className={styles.LenDisplay}>{props.totalTabCols}</span>
                {/* <span> */}
                    <button className={styles.MiniButton} onClick={()=>{props.changeTotalTabCols(-1)}}>▼</button>
                    
                    <button className={styles.MiniButton} onClick={()=>{props.changeTotalTabCols(1)}}>▲</button>                
                {/* </span> */}
                
                </p>
                
                
                <div className={styles.ButtonGroup}>
                <button style={{background:'red'}} onClick={()=>{setDeleteConfirm(true)}}>Delete All Tab</button>
                <button onClick={modalToggle}>Close</button>
                </div>
            </div>

            : 
            
            <div>
                <h2>Are you sure you want to delete all your tab?</h2>
                <div className={styles.ButtonGroup}>
                    <button onClick={()=>{setDeleteConfirm(false)}}>Cancel</button>
                    <button style={{background:'red'}} onClick={deleteAll}>Yes, Delete All</button>
                    
                </div>
            </div>
            
            
            
            }
        </Modal>

        <div className={styles.TabDisplayContainer}>
        <TabTextCursor cursorMode={props.cursorMode} 
        totalTabCols={props.totalTabCols}
        cursor={props.cursor} tab={props.tab}
        startViewAt={props.startViewAt}
        atStart={props.atStart}
        editMode={props.editMode}
        />
        
        <TabShuttle 
            toBeginning={props.toBeginning}
            toEnd={props.toEnd}
            moveTab={props.moveTab}
        
        />

        <div className={styles.SliderContainer}>
        
        {props.tab.length>props.totalTabCols ?
        
        <input className={styles.CenteredSlider} type="range" name="docLocation" min="0" max="100" step="1" value={((props.startViewAt)/(props.tab.length-props.totalTabCols))*100} onChange={(e)=>{props.sliderToLocation(e.target.value)}}/>

        :
        
        <input className={styles.CenteredSlider} type="range" name="docLocation" min="0" max="100" step="1" value={0} onChange={(e)=>{props.sliderToLocation(e.target.value)}}/>

        }
        
        
        
        <div className={styles.InputsGroup}>
        
        <TabInputs playedNotes={props.playedNotes}
            playedNoteChange={props.playedNoteChange}
        />

        
        <div className={styles.ButtonGroup}>

        <button className={styles.CoolButton} onClick={props.clearBoard}>Clear</button>
        <button className={styles.CoolButton} onClick={props.insertBar}>Bar</button>
        <button className={styles.CoolButton} onClick={props.addTab}>Insert</button>
        
        </div>

        </div>

        </div>
        
            <div style={{textAlign:'center', marginTop:'20px'}}>            
                {undo}
                {redo}
            </div>
        


        </div>

       

        <Modal show={showAbout}>
            <div style={{textAlign:'center'}}>
            <h2>About TabFast</h2>
            <p>Created by George Moore, 2020, using React.js. This is just a beta/demo, but happy to add functionality if there is interest. There are some bugs with this, especially with mobile viewing, so feedback is welcome. </p>
            
            <a href="https://twitter.com/georgemoore32" target="_blank" rel="noopener noreferrer">
                <img src={twitter} alt='Twitter icon' style={{height:'30px', width: '30px'}}></img>
            </a>
            
            <a href="https://github.com/geo-coder/TabFast" target="_blank" rel="noopener noreferrer">
                <img src={github} alt='GitHub icon' style={{height:'30px', width: '30px', marginLeft:'10px'}}></img>
            </a>
            <br/><br/>
            <button onClick={toggleAbout}>Ok</button>
            </div>

        </Modal>
        
        <p className={styles.logo} onClick={toggleAbout}>About</p>

    </div>)
}

export default TabDisplay