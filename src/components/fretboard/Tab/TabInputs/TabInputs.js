import React from 'react'
import styles from '../TabDisplay.module.css'


const TabInputs = (props) => {


    let playedNotes=props.playedNotes.map((item)=>{

        if (item===-1) item='-'
        if (item===-2) item='/'
        if (item===-3) item='\\'
        if (item===-4) item='|'
        return item
    })





    let inputList=[]
    
    for (let x=0;x<6;x++){
        let optionList=[]

        optionList.push(<option key={'tabInput' + x +'cvafasd'} value={'-'}>{'-'}</option>, <option key={'tabInput' + x +'cvwaerd'} value={'/'}>{'/'}</option>, <option key={'tabInput' + x +'awefwawrd'} value={'\\'}>{'\\'}</option>, <option key={'tabInput' + x +'weafet'} value={'|'}>{'|'}</option>)
        
        for (let x=0; x<23;x++){
            optionList.push(<option key={'optList-'+x} value={x}>{x}</option>)
        }
        
        inputList.push(<select onChange={(e)=>{props.playedNoteChange(e.target.value, x)}} value={playedNotes[x]} className={styles.TabInput} key={'tabInput'+x}>{optionList}</select>)

    }
    
    
    
    return(<div className={styles.InputWrapper}>

        {inputList}

    </div>)
}

export default TabInputs