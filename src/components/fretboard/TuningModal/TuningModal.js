import React, {Component} from 'react'
import styles from '../fretboard.module.css'
import Select from '../UI/Select/Select'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeOff} from '@fortawesome/free-solid-svg-icons'
import TuningModalStyle from './TuningModalStyle.module.css'



class TuningModal extends Component {

    state = {
        currentTuning: [],
        currentOctaves:[]
    }

    componentDidMount = () =>{
        this.setState({currentTuning:this.props.tuningAlpha, currentOctaves:this.props.tuningOctaves})
    }

    //update tuning in modal
    changeCurrentTuning =(e, string) =>{
        let currentTuning=[...this.state.currentTuning]
        currentTuning[string]=e.target.value
        this.setState({currentTuning})


    }


    setToStandardTuning = () =>{
        this.setState({currentTuning:['E','A','D','G','B', 'E'], currentOctaves:[2,2,3,3,3,4]})
    }

    //update octaves in modal
    changeOctaves = (e, string) =>{
        let currentOctaves=[...this.state.currentOctaves]
        currentOctaves[string]=e.target.value
        this.setState({currentOctaves})

    }

    
    //set new tuning and close modal
    setNewTuning=()=>{

        this.props.changeTuningAll(this.state.currentTuning,this.state.currentOctaves)
        this.props.toggleFretBoardModal()

    }

    

    render (){

        let selectData=this.props.noteList.map(item=>({value:item, display:item}))
        let octaveSelectData=[1,2,3,4,5,6].map(item=>({value:item.toString(), display:item}))

        let selectList=this.state.currentTuning.map((item,index)=><div key={'selectL'+index} className={TuningModalStyle.TunerRow}>
                <Select value={item} optionsList={selectData} style={TuningModalStyle} changeHandle={this.changeCurrentTuning} string={index} />
                <Select value={this.state.currentOctaves[index]} optionsList={octaveSelectData} style={TuningModalStyle} string={index} changeHandle={this.changeOctaves} />
                <button className={TuningModalStyle.AuditionButton} onClick={()=>{this.props.auditionNote(item, this.state.currentOctaves[index])}}><FontAwesomeIcon icon={faVolumeOff} /></button>
                
            
            </div>)

        

        
        //conditional styling for the standard tuning button; inactive when proposed tuning is standard
        let standardTuningButtonStyle=styles.SimpleButton        
        const standard=['E','A','D','G','B','E']
        const standardOctaves=[2,2,3,3,3,4]       

        if (this.state.currentTuning.every((value, index) => value===standard[index]) && this.state.currentOctaves.every((value, index) => value===standardOctaves[index])) {
            
            standardTuningButtonStyle=styles.SimpleButton + ' ' + styles.SimpleButtonInactive
        }


        return(
            <div style={{textAlign:'center'}}>
                <h2>Change Tuning</h2>               
                
                
                <button className={standardTuningButtonStyle} onClick={this.setToStandardTuning}>Restore to Standard Tuning</button>
                
                {selectList}
                
            
                <div className={styles.ButtonGroup}>
                    <button onClick={this.props.toggleFretBoardModal}>Cancel</button>
                    <button onClick={this.setNewTuning}>Apply Changes</button>

                        
                </div>
            </div>
        )
    }


}

export default TuningModal