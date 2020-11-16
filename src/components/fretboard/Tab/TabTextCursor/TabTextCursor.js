import React from 'react'
import styles from '../TabDisplay.module.css'



const TabTextCursor = (props) =>{

    
    
    


    
    let tabData = props.tab.slice(props.startViewAt, props.startViewAt+props.totalTabCols) //before added 1 to totaltabcol



    
    let colList=tabData.map((col, colIndex)=>{


        let double=false
        for (let x=0; x<col.length;x++){ //is there a two digit value in the column?
            
            
            if (col[x]>9) {
                double=true
                break
            }
        }

        let charList= col.map((char , index) => {
        
        char=char.toString()
        

        //translate special numeric codes to special tab symbols
        if (char==='-1') char='-'
        if (char==='-2') char='/'
        if (char==='-3') char='\\'
        if (char==='-4') char='|'




        if (double && char.length===1) char=char + '-' //if the column has a two digit value, any one-length val nees an added dash
        
        //if (colIndex>0) char='-'+char //add spacing between lines
        char=char+'-'
        

        return <p className={styles.TabTextChar} key={index}>{char}</p>
        })
        

        let columnStyles=styles.TabTextCol
        
        
        //conditional styling to display the cursor
        
        if (props.editMode==='insert') {
            //identify if the column is selected and add styling
            if (colIndex===props.cursor && !props.atStart) {
                columnStyles = columnStyles+' ' + styles.SelectedCol}
            else if (colIndex===0 && props.atStart) {
                columnStyles = columnStyles + ' ' + styles.SelectedStart
            }
        } else if (props.editMode==='overwrite'){
            
            if (colIndex===props.cursor) {
                columnStyles = columnStyles+' ' + styles.SelectedOverwrite
            }


        }
        
        
        
        //create a 'ruler' at the top of the tab viewer numbering every 5th bar
        let cursorLoc = colIndex+props.startViewAt+1
        let rulerChar
        
        if (cursorLoc %5 === 0 || cursorLoc===1) {rulerChar=<span>{cursorLoc}</span>}
        else{
            rulerChar=' '
        }

        if (cursorLoc===props.tab.length) rulerChar=<span>{'#'}</span>
        


        //charList.unshift(<p className={styles.RulerTextChar}>{cursorLoc % 10 === 0 || cursorLoc===1 ? <span>{cursorLoc}</span> : ' ' }</p>)
        charList.unshift(<p key={colIndex+'rulerChar'} className={styles.RulerTextChar}>{rulerChar}</p>)

        return <div className={columnStyles} key={colIndex}>{charList}</div>
    })
    
    
    
    let endLine=[]

    for (let x=0;x<6;x++) {
        endLine.push(<p className={styles.TabTextChar} key={x}>--</p>)
    }
    
    if (colList.length<props.totalTabCols) {

        let remaining=props.totalTabCols-colList.length
        for (let x=0;x<remaining;x++){
            colList.push(
                <div className={styles.TabTextCol} key={'blankCol' + x}>
                    <p className={styles.RulerTextChar}>{' '}</p>
                    <p className={styles.DummyTextChar}>--</p>
                    <p className={styles.DummyTextChar}>--</p>
                    <p className={styles.DummyTextChar}>--</p>
                    <p className={styles.DummyTextChar}>--</p>
                    <p className={styles.DummyTextChar}>--</p>
                    <p className={styles.DummyTextChar}>--</p>

                </div>


            )
        }

    }
    



    return(<div className={styles.TabCursor}>
        
        
        
        {colList}
        
        
        
        
        
    </div>)
}

export default TabTextCursor