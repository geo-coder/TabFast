import React , {useRef, useState} from 'react'
import TabDocumentToolBar from './TabDocumentToolBar/TabDocumentToolBar'
import styles from './TabDocument.module.css'
import Modal from '../UI/Modal/Modal'

import {CopyToClipboard} from 'react-copy-to-clipboard'

const TabDocument = (props) =>{

    const textAreaRef=useRef(null)
    const [showOptionModal, setShowOptionModal] = useState(false)
    
    const [modalBarBased, setModalBarBased] =useState(props.barBasedSizing)


    
    const [oldBetween, setOldBetween] = useState()



    const optionModalOpen=()=>{
        setShowOptionModal(true)
        setModalBarBased(props.barBasedSizing)
        setOldBetween(props.betweenStave) //capture value of betweenStave on modal open
    }

    
    const approve =()=>{
        
        setShowOptionModal(false)
        props.toggleBarBased(modalBarBased)
        
    }

    const cancel = () =>{

        let difference= oldBetween - props.betweenStave //restore betweenStave to what it was when modal opened
        props.changeBetweenStave(difference)
        
        setShowOptionModal(false)
    }
    


    let colMax=props.staffLength-1
    let tabLength=props.tab.length
   

   let tabString=''

    

   if (props.tab[0] && !props.barBasedSizing){
    
    
        
        for (let barBreakPoint = 0; barBreakPoint<tabLength; barBreakPoint+=colMax+1) {
            
            
            for (let string=0; string<6; string++) {
                for (let i=barBreakPoint; i<=barBreakPoint+colMax;i++){

                        
                        let addString=''
                        let spacing='-'.repeat(props.barSpacing)
                        if (!props.tab[i]) break
                        let doublePresent=false

                        for (let x=0;x<6;x++){
                            if (props.tab[i][x]>9) {
                                doublePresent=true
                                break
                            }
                        }

                        

                        addString=props.tab[i][string].toString()


                        if (addString==='-1') addString='-'
                        if (addString==='-2') addString='/'
                        if (addString==='-3') addString='\\'
                        if (addString==='-4') addString='|'

                        
                     

                        if (doublePresent && addString.length===1) addString+='-'
                        

                        tabString+=addString+spacing

                }
                tabString+='\n'
            }

            tabString+='\n'.repeat(props.betweenStave) //spacing between staves
        }
    }
   

    if (props.tab[0] && props.barBasedSizing) {
        let barLocations=[0] //identify where bars are in the tab
        
        for (let col=0;col<tabLength; col++){
            let bar=true
            for (let string=0; string<6; string++){

                if (props.tab[col][string]!==-4) {
                    bar=false
                    break
                }
            }
            if (bar) {
                barLocations.push(col)
            }

        }
        
        

        for (let segment=0; segment<barLocations.length; segment+=props.barBasedLength){
            
            
            
            let end=props.tab.length
            if (barLocations[segment+props.barBasedLength]) end=barLocations[segment+props.barBasedLength]

            for (let string=0; string<6; string++){
                for (let i=barLocations[segment]; i<end; i++){
                    
                    let addString=''
                    let spacing='-'.repeat(props.barSpacing)
                    if (!props.tab[i]) break
                    let doublePresent=false

                    for (let x=0;x<6;x++){
                        if (props.tab[i][x]>9) {
                            doublePresent=true
                            break
                        }
                    }

                    addString=props.tab[i][string].toString()


                    if (addString==='-1') addString='-'
                    if (addString==='-2') addString='/'
                    if (addString==='-3') addString='\\'
                    if (addString==='-4') addString='|'

                    
                 

                    if (doublePresent && addString.length===1) addString+='-'
                    

                    tabString+=addString+spacing

                
                }
                //tabString+='|' 
                tabString+='\n'
            }
            
            
            tabString+='\n'.repeat(props.betweenStave)
            
        }


        


    }

    



    let docAdjust=<div>
    
            <div className={styles.InputWrapper}>
               
                <p>Staff length: <span className={styles.NumDisplay}>{props.staffLength}</span>
                <span>
                    <button className={styles.MiniButton} onClick={()=>{props.changeStaffLength(-1)}}>▼</button>
                    <button className={styles.MiniButton} onClick={()=>{props.changeStaffLength(1)}}>▲</button>                
                </span>
                </p>

                
                

            </div>
    
                    <div className={styles.InputWrapper}>
                        <p>Column width: <span className={styles.NumDisplay}>{props.barSpacing}</span>
                        <span>
                            <button className={styles.MiniButton} onClick={()=>{props.changeBarSpacing(-1)}}>▼</button>
                            <button className={styles.MiniButton} onClick={()=>{props.changeBarSpacing(1)}}>▲</button>                
                        </span>
                        </p>
                    </div>
            </div>

    if (props.barBasedSizing) docAdjust=<div>
               
            <div className={styles.InputWrapper}>
               
               <p>Bars per stave: <span className={styles.NumDisplay}>{props.barBasedLength}</span>
               <span>
                   <button onClick={()=>{props.changeBarSizing(-1)}}>▼</button>
                   <button onClick={()=>{props.changeBarSizing(1)}}>▲</button>                
               </span>
               </p>

               
               

           </div>
        
        
        </div>


   
   
   return(<React.Fragment>
    <TabDocumentToolBar changeView={props.changeView} optionModalOpen={optionModalOpen}/>
        <div className={styles.DocContainer}>

        <Modal show={showOptionModal}>
            <h2>Tab Document Options</h2>
            
            <label>
                Bar-based staff length: 
                <input type="checkbox" checked={modalBarBased} onChange={()=>{setModalBarBased(!modalBarBased)}}></input>
            </label>
            
            <br/>

            <p>Lines Between Staves: <span> <span className={styles.NumDisplay}>{props.betweenStave} </span>
            
                <button className={styles.MiniButton} onClick={()=>{props.changeBetweenStave(-1)}}>▼</button>
                <button className={styles.MiniButton} onClick={()=>{props.changeBetweenStave(1)}}>▲</button>
                </span>
            </p>
            

            <div className={styles.ButtonGroup}>
                <button onClick={cancel}>Cancel</button>
                <button onClick={approve}>Ok</button>
            </div>
        </Modal>


            <textarea ref={textAreaRef} readOnly value={tabString}></textarea>
            <br/>
            

            

            {docAdjust}
            
            <CopyToClipboard text={tabString}>
                <button>Copy to Clipboard</button>
            </CopyToClipboard>
            
            
        </div>


   </React.Fragment>)
}

export default TabDocument