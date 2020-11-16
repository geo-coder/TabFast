import React, {Component} from 'react'
import Fret from './Fret/Fret'
import FretBoardToolbar from './FretBoardToolbar/FretboardToolbar'
import TabDisplay from './Tab/TabDisplay'
import TabDocument from './TabDocument/TabDocument'
import Modal from './UI/Modal/Modal'
import TuningModal from './TuningModal/TuningModal'
import FretReadOut from './FretReadOut/FretReadOut'


import * as Tone from 'tone'



import styles from './fretboard.module.css'



class Fretboard extends Component{

    state={
        
        noteList:['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], //all notes in the key
        tuning:[4,9,2,7,11,4], //tuning based on where note is  in notelist
        tuningOctaves:[2,2,3,3,3,4],
        tuningAlpha: ['E', 'A', 'D', 'G', 'B', 'E'], //establishes tuning in alpha numeric
        totalFrets: 22,
        playedNotes: [-1,-1,-1,-1,-1,-1], //-1 means nothing played ('-')
        

        tab: [],
        viewMode: 'fretBoard', //fretBoard
        cursor: -1, //index of where the cursor is in tabviewer
        cursorMode: 'end',
        totalTabCols: 9, //total num of columns in tabviewer
        startViewAt:0,  //when moving cursor, defines where inside tab array the view begins at
        editMode: 'insert', // 'insert' for adding new; 'overwrite' for writing over old
        atStart: false,


        staffLength:5, //length of staff inside text export document
        barSpacing: 1,
        barBasedSizing: false, // toggles whether to size tab document based on how many bars user inserted
        barBasedLength: 4, //number of bars per line

        betweenStave: 2, //how many returns after each stave

        showFretBoardModal: false,
        

        lastChangeUndo: false,        
        undoLoc:2,
        
        
        
        undoHistory:[],
        redoHistory:[],
        undoCount:0, //number of times undo is pressed continuously
        redoCount:0
        

    }


    
    //initialize synth for playing tabnotes
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    

    //updates the undohistory every time tab is changed; this update gets the previous state
    undoUpdate=(prevState)=>{
        
        
        
        //undo and redo history contain the previous tab data, cursor location, size of tab display, and where the display started
        let newHistoryObject={ 
            tab: [...prevState.tab],
            cursor: prevState.cursor,
            totalTabCols: prevState.totalTabCols,
            startViewAt: prevState.startViewAt

        }


        let undoHistory=[...this.state.undoHistory]

        undoHistory.push(newHistoryObject)
        

        

        if (undoHistory.length>4) undoHistory.shift() //maximum undos is 4 
        
        this.setState({undoCount:0, undoHistory}) //undocount measures how many times undo is clicked continuously
    }
    
    //execute an undo
    undo = () =>{
        
        
        if (!this.state.undoHistory.length) return
        
        //for each undo, add a redo object to redo history
        let redoHistory=[...this.state.redoHistory]
        let redoObject={
            tab: [...this.state.tab],
            cursor: this.state.cursor,
            totalTabCols: this.state.totalTabCols,
            startViewAt: this.state.startViewAt
        }
        redoHistory.push(redoObject)
        if (redoHistory.length>4) redoHistory.shift()
        
        
        //undo updating
        let undoCount=this.state.undoCount+1
        
        

        let undoHistory=[...this.state.undoHistory]
        
        let undoHistoryLen=undoHistory.length
        
        let playedNotes = [-1,-1,-1,-1,-1,-1]
        if (this.state.editMode==='overwrite') {
            let loc=undoHistory[undoHistoryLen-1].cursor+undoHistory[undoHistoryLen-1].startViewAt
            let tabNotes=[...undoHistory[undoHistoryLen-1].tab[loc]]
            tabNotes.reverse()
            playedNotes=[...tabNotes]
            
        }
               
        
        this.setState({tab:undoHistory[undoHistoryLen-1].tab, 
            cursor:undoHistory[undoHistoryLen-1].cursor,
            totalTabCols: undoHistory[undoHistoryLen-1].totalTabCols,
            startViewAt: undoHistory[undoHistoryLen-1].startViewAt,
            playedNotes,  
            undoCount, 
            redoHistory}, ()=>{
            undoHistory.pop()
            this.setState({undoHistory})
            
        
        })
        
    }
    
    //execute a redo
    redo=()=>{
        

        let rdLen=this.state.redoHistory.length

        if (!this.state.redoHistory.length) return
        
        
        let redoCount=this.state.redoCount+1
        let redoLoc=this.state.redoHistory.length-redoCount
        if (redoLoc<0) redoLoc=0


        let undoSingleObject=[this.state.undoHistory]
        undoSingleObject.push(this.state.redoHistory[rdLen-1])
        undoSingleObject.splice(0,undoSingleObject.length-2)
        
        if (redoCount===1){
            let underHistorySingle=[...this.state.undoHistory]
            underHistorySingle.splice(0,underHistorySingle.length-2)
            
            this.setState({tab:this.state.redoHistory[rdLen-1].tab, 
                cursor: this.state.redoHistory[rdLen-1].cursor,  
                totalTabCols: this.state.redoHistory[rdLen-1].totalTabCols,
                startViewAt: this.state.redoHistory[rdLen-1].startViewAt,
                
                redoCount, 
                undoHistory:underHistorySingle},()=>{
                let newRd=this.state.redoHistory
                newRd.pop()
                this.setState({redoHistory:newRd})
                
            })

        } else {
            this.setState({tab:this.state.redoHistory[rdLen-1].tab, 
                cursor: this.state.redoHistory[rdLen-1].cursor, 
                totalTabCols: this.state.redoHistory[rdLen-1].totalTabCols,
                startViewAt: this.state.redoHistory[rdLen-1].startViewAt,
                redoCount},()=>{
                let newRd=this.state.redoHistory
                newRd.pop()
                this.setState({redoHistory:newRd})
                
              })
        }
    }
    
    componentDidUpdate = (prevProps, prevState)=>{

        if (prevState.tab !==this.state.tab && prevState.undoCount===this.state.undoCount && prevState.redoCount===this.state.redoCount){
            //when tab is changed without using undo or redo, update undo history
            this.setState({redoHistory:[]})
            this.undoUpdate(prevState)            
        } else if(prevState.tab !==this.state.tab && prevState.undoCount===this.state.undoCount && prevState.redoCount!==this.state.redoCount){
            //tab changed with redo
            this.undoUpdate(prevState)
        }

    }


    
    changeTuning = (string, newValue) => {
        //changes tuning of single string
        let tuningCopy=[...this.state.tuningAlpha]
        tuningCopy[string]=newValue
        this.setState({tuningAlpha:tuningCopy})
    }

    
    //updates the tuning--all notes and all octaves
    changeTuningAll=(tuningNotes, tuningOctaves)=>{
        this.setState({tuningAlpha:tuningNotes, tuningOctaves:tuningOctaves})
    }

    changeView=(view)=>{
        this.setState({viewMode: view})
        
    }

    toggleFretBoardModal = () =>{
        this.setState((state) => ({
            showFretBoardModal: !state.showFretBoardModal
          }))
    }

    toggleBarBased = (isBarBased) =>{ //length of staves in document is measured by # of bars
        
        this.setState({barBasedSizing:isBarBased})
        
    }

    
    clearBoard = () =>{ //clears the fretboard and playedNotes
        this.setState({playedNotes:[-1,-1,-1,-1,-1,-1]})
    }
    
    
    
    
    
    toBeginning =()=>{ //moves cursor to beginning of all tab
        this.setState({cursor:0, startViewAt:0, atStart:true})
    }

    toEnd = () =>{ //moves cursor to end of all tab
        if (this.state.tab.length>this.state.totalTabCols){
            this.setState({startViewAt: this.state.tab.length - this.state.totalTabCols, cursor: this.state.totalTabCols-1, atStart:false})
        } else {
            this.setState({cursor:this.state.tab.length-1, atStart:false})
        }

    }


    sliderToLocation = (location) =>{
       
        let newLoc=Math.round(((location)/100)*(this.state.tab.length-this.state.totalTabCols))

        this.setState({startViewAt:newLoc, cursor:0, atStart:false})

    }
    
    
    deleteTab=()=>{ //deletes a column of tab
        let tab=[...this.state.tab]
        let cursor=this.state.cursor
        let startViewAt=this.state.startViewAt

        if (this.state.editMode==='insert'){
  
            
            if (this.state.atStart){
                tab.shift()
            } else {
                tab.splice(cursor+startViewAt+1,1)
            }
            this.setState({tab})
        } else if (this.state.editMode==='overwrite'){
            tab.splice(cursor+startViewAt,1)
            if (cursor+startViewAt===tab.length && cursor>0){
                cursor--
            }
            
            this.setState({tab, cursor})
        }

    }


    playNotes =() =>{
        
        
        Tone.start()
        let playedNotes=this.state.playedNotes
        let playedData=this.readChord(playedNotes)
        
        const now = Tone.now()
        let releaseArray=[]
        let add=0 //add increments in order to create an arpeggiated sound when notes are played
        for (let x=0; x<playedData.length; x++){
            
            let playString=playedData[x].note+playedData[x].octave.toString()
            this.synth.triggerAttack(playedData[x].note+playedData[x].octave.toString(), now+add);
            releaseArray.push(playString)
            add+=.04
        }
        
        this.synth.triggerRelease(releaseArray, now + .8)
        
        
    }

    //play a single note (for use in tuning modal)
    auditionNote = (note, octave) =>{
        
        let noteOctave=note+octave.toString()
        
        Tone.start()
        this.synth.triggerAttackRelease(noteOctave, "8n");

    }


    addTab=()=>{ //adds a column of tab
        
        let tab=[...this.state.tab]
        let cursor=this.state.cursor
        let startViewAt=this.state.startViewAt

        let playedNotes=[...this.state.playedNotes]
        playedNotes.reverse()

        


        if (this.state.editMode==='insert'){

            
            if (this.state.atStart){ //special case of inserting at the very beginning of the tab array
                
                tab.unshift(playedNotes)
                this.setState({tab, atStart:false})   
                this.clearBoard() 
                return
            }
            
            
            tab.splice(startViewAt+cursor+1,0,playedNotes)
            if (cursor+1<this.state.totalTabCols) { //if cursor is not at end of viewer, move it up one
                cursor++               
               
                
                
            } else { //if cursor is at the end, startViewAt up by one
                
                startViewAt++
            }
            
            
            
            
            this.setState({tab,cursor,startViewAt})
            
            

        } else if (this.state.editMode==='overwrite') { //add tab conditions in overwrite mode

            
            tab.splice(startViewAt+cursor,1,playedNotes)
            
            
            
            if (cursor+1<this.state.totalTabCols && tab.length>=cursor+startViewAt+2) { //if cursor is not at end of viewer and there is tab in front of it, move it up one
                cursor++               
               
                
                
            } else if (cursor+1===this.state.totalTabCols && tab.length>=cursor+startViewAt+2) { //if cursor is at the end and there is tab in front, startViewAt up by one
                
                startViewAt++
            }
            
            
            
            this.setState({tab,cursor,startViewAt}, ()=>{

                let newPlayed=[...this.state.tab[this.state.cursor+this.state.startViewAt]]
                
                newPlayed.reverse()
                this.setState({playedNotes:newPlayed})
                
            })
        }


        this.clearBoard()
    }


    moveTab = (change) =>{ //runs when cursor is moved
        let cursor=this.state.cursor
        let startViewAt=this.state.startViewAt

        
        if (cursor===0 && change===-1 && startViewAt>0){ 
            //if cursor is at beginning and tries to move left and there is tab before it
            
            startViewAt--
            this.setState({startViewAt})
        } else if(cursor===0 && change<0 && startViewAt===0 && !this.state.atStart){ 
            // cancel if you try to go left and there is no tab prior
            
            this.setState({atStart:true})
        
        } else if(change<-1 && !this.state.atStart && startViewAt-this.state.totalTabCols>=0){
            //if a long jump to the left is bigger than available space, but there is more tab, shift startViewAt
            
            
            let newStartView=startViewAt-this.state.totalTabCols
            let newCursor=Math.round(this.state.totalTabCols/2)
            
            
            this.setState({startViewAt:newStartView, cursor:newCursor})

        } else if(change<-1 && !this.state.atStart && startViewAt>0 && startViewAt-this.state.totalTabCols<0){

            let newCursor=Math.round(this.state.totalTabCols/2)
            this.setState({startViewAt:0, cursor:newCursor })
        } else if(change<-1 && !this.state.atStart && startViewAt===0 && change-cursor>=0){
            
            this.setState({cursor:0, atStart:true})



        } else if(cursor===0 && change<0 && this.state.atStart) {
            return
            
        } else if (change===1 && cursor+1===this.state.totalTabCols && startViewAt+this.state.totalTabCols<=this.state.tab.length-1){
            startViewAt++
            this.setState({startViewAt})
            
        } else if ((change===1 && cursor+1===this.state.totalTabCols && startViewAt+this.state.totalTabCols>this.state.tab.length-1)) {
            //prevent cursor from overrunning right if there is no more tab to the right
            
            return
            

        } else if((change===1 && cursor>=this.state.tab.length-1)){
            // prevents cursor from overrunning when tab length is < total col length
            return

        } else if(change===1 && this.state.atStart) {
            this.setState({atStart:false})

        } else if(change>1 && change+cursor+1>this.state.totalTabCols && startViewAt+(this.state.totalTabCols*2)<this.state.tab.length){
            let newStartView=startViewAt+this.state.totalTabCols
            
            
            
            this.setState({startViewAt:newStartView, cursor:1})
        } else if(change>1 && change+cursor+1>this.state.totalTabCols && startViewAt+(this.state.totalTabCols*2)>=this.state.tab.length && startViewAt+this.state.totalTabCols<this.state.tab.length) {

            let startViewAt=this.state.tab.length-this.state.totalTabCols
            this.setState({startViewAt,cursor:1})

        } else if(change>1 && change+cursor>this.state.tab.length-startViewAt){
            
            let end=(this.state.tab.length-1)-startViewAt
            this.setState({cursor:end})


        }else{
            
        cursor+=change
        if (cursor<0) cursor=0 //lazy work around for problems caused by long jump to the left with no more tab
        if (cursor>this.state.totalTabCols-1) cursor=this.state.totalTabCols-1 //lazy work around for overshooting right 
        
        
        this.setState({cursor}, ()=>{
            if (this.state.editMode==='overwrite'){ //if in 'overwrite' mode, any notes in cursor should appear on fretboard
                let played=[...this.state.tab[cursor+this.state.startViewAt]]
                played=played.reverse()
                
                this.setState({playedNotes:played})
            }


        })
        }
    }

    
    readChord = (notes) =>{

        let notesAlpha=[]
        let tuningOctaves=[...this.state.tuningOctaves]

        //converts numeric notes to alph notes
        for (let string=0;string<6;string++){

            if (notes[string]>=0) {
                
            let openNote=this.state.tuningAlpha[string]
            let pointer=this.state.noteList.findIndex(item => item===openNote)
            let octave=tuningOctaves[string]
            //if (notes[string]>12) octave--
            
            for (let counter=0;counter<notes[string];counter++){
            
                pointer=pointer+1
                if (pointer===this.state.noteList.length) pointer=0
                if (this.state.noteList[pointer]==='C') octave++
                
            }
                
                
            
               // notesAlpha.push([this.state.noteList[pointer], octave])
               notesAlpha.push({string:string, note:this.state.noteList[pointer], octave:octave})
        
            }


        
        }

        
        return notesAlpha

    }
    
    
    
    activateNote = (newNoteNumber, stringNumber) =>{
        let playedNotes=[...this.state.playedNotes]
        
        if (playedNotes[stringNumber]===newNoteNumber) { //if note is already activated turn off
            playedNotes[stringNumber]=-1
        } else {
            playedNotes[stringNumber]=newNoteNumber //turn on
        }

        
        
        
        this.setState({playedNotes})
    }

    changeStaffLength = (newVal) => {
        let staffLength=this.state.staffLength

        staffLength+=newVal

        if (staffLength<2) staffLength=2
        
        
        this.setState({staffLength})
    }


    changeBetweenStave = (newVal)=>{

        let betweenStave=this.state.betweenStave
        betweenStave+=newVal
        if (betweenStave<1) betweenStave=1
        this.setState({betweenStave})


    }
    
    
    
    changeBarSizing = (addVal) =>{
        let barBasedLength=this.state.barBasedLength+addVal
        if (barBasedLength<1) barBasedLength=1
        
        this.setState({barBasedLength})

    }


    insertBar = ()=>{
        
        //inserts a bar made up of the '|' char; (-4 is the code for '|')
        this.setState({playedNotes:[-4,-4,-4,-4,-4,-4,]})
    }

    playedNoteChange =(value , string) =>{ //use this to change played notes using Select elements
        
        let playedNotes=[...this.state.playedNotes]
               
       
        switch (value) {


            case ('-'):
                value=-1
                break
            case ('/'):
                value=-2
                break
            case('\\'):
                value=-3
                break
            case('|'):
                value=-4
                break
            default:
                value=parseInt(value)


        }



        playedNotes[string]=value
        this.setState({playedNotes})
    }

    toggleBackdrop=()=>{
        this.setState((state) => {
            // Important: read `state` instead of `this.state` when updating.
            return {showBackDrop: !state.showBackDrop}
          });
    }

    changeTotalTabCols =(newVal) =>{
        
        let totalTabCols=this.state.totalTabCols

        totalTabCols+=newVal

        if (totalTabCols<1) totalTabCols=1
        
        if (window.screen.width <= 1280){
            if (totalTabCols>12) totalTabCols=12
            
        }
        
        
        this.setState({totalTabCols})
    }


    changeBarSpacing = (change) =>{

        let barSpacing=this.state.barSpacing
        barSpacing+=change
        
        if (barSpacing<1) barSpacing=1

        this.setState({barSpacing})

    }


    deleteAll = () => {
        this.setState({tab:[], playedNotes:[-1,-1,-1,-1,-1,-1], cursor:-1, startViewAt:0})
    }

    editModeToggle = () =>{
    let editMode=this.state.editMode
    
    
    
    if (editMode==='insert' && this.state.tab.length>0) { //overwrite is only possible if there is 1 or more elements in tab
        editMode='overwrite'
    } else if (editMode==='overwrite') {
        editMode='insert'
    }
    this.setState({editMode}, ()=>{

        if(editMode==='overwrite'){ //if user changes to 'overwrite' mode, notes in cursor appear in fretboard
            let played=[...this.state.tab[this.state.cursor+this.state.startViewAt]]
            played=played.reverse()
            
            this.setState({playedNotes:played})

        } else if (editMode==='insert'){ //if user changes to 'insert' mode, clear fretboard
            this.clearBoard()
        }


    })


    }


    render(){

        let fretList=[]
        for (let fretNumber=0; fretNumber<=this.state.totalFrets;fretNumber++){
            fretList.push(<Fret 
                            key={'fret'+fretNumber} 
                            fretNumber={fretNumber} 
                            noteList={this.state.noteList} 
                            tuning={this.state.tuningAlpha}
                            playedNotes={this.state.playedNotes}
                            activateNote={this.activateNote}
                            />)
        }

        
        let fretBoardClassList=[]
        let tabClassList=[]
        let tabDocumentClassList=[]
        
        //determine what to show and hide based on ViewMode; this could be replaced w reactrouter
        
        switch (this.state.viewMode){
            case 'tab':
                fretBoardClassList=[styles.FretboardContainer, styles.MobileHidden].join(' ')
                tabDocumentClassList=[styles.TabDocumentContainer, styles.MobileHidden].join(' ')
                tabClassList=styles.MobileTabContainer
                break
            case 'fretBoard':
                fretBoardClassList=styles.FretboardContainer
                tabClassList=[styles.MobileTabContainer, styles.MobileHidden].join(' ')
                tabDocumentClassList=[styles.TabDocumentContainer, styles.MobileHidden].join(' ')
                break
            case 'tabDocument':
                tabClassList=[styles.MobileTabContainer, styles.MobileHidden].join(' ')
                fretBoardClassList=[styles.FretboardContainer, styles.MobileHidden].join(' ')
                tabDocumentClassList=styles.TabDocumentContainer
                break
            default:
                fretBoardClassList=[styles.FretboardContainer, styles.MobileHidden].join(' ')
                tabDocumentClassList=[styles.TabDocumentContainer, styles.MobileHidden].join(' ')
                tabClassList=styles.MobileTabContainer
                break


        }
        
        return(
        <React.Fragment>
        
        <Modal show={this.state.showFretBoardModal}>

            
            <TuningModal 
                noteList={this.state.noteList}
                toggleFretBoardModal={this.toggleFretBoardModal}
                auditionNote={this.auditionNote}
                changeTuningAll={this.changeTuningAll}
                tuningAlpha={this.state.tuningAlpha}
                tuningOctaves={this.state.tuningOctaves}
                
                />

        </Modal>

        <div className={styles.FullScreen}>
        <div className={fretBoardClassList}> 
        
        <FretBoardToolbar 
            clearBoard={this.clearBoard} 
            addTab={this.addTab} 
            changeView={this.changeView}
            playNotes={this.playNotes}
            toggleFretBoardModal={this.toggleFretBoardModal}/>
        
        
        
        <div className={styles.Neck}>
        
            <FretReadOut playedNotes={this.state.playedNotes} playedNoteChange={this.playedNoteChange} />
            {fretList}

            <div className={styles.StringContainer}>

                <div className={styles.String}></div>
                <div className={styles.String}></div>
                <div className={styles.String}></div>
                <div className={styles.String}></div>
                <div className={styles.String}></div>
                <div className={styles.String}></div>

            </div>
            
            
        </div>
        </div>

        

        


        <div className={tabClassList}>
            
            
            <TabDisplay moveTab={this.moveTab} cursor={this.state.cursor} cursorMode={this.state.cursorMode}
            changeView={this.changeView} 
            deleteTab={this.deleteTab}
            toBeginning={this.toBeginning}
            sliderToLocation={this.sliderToLocation}
            insertBar={this.insertBar}
            clearBoard={this.clearBoard}
            toggleBackdrop={this.toggleBackdrop}
            changeTotalTabCols={this.changeTotalTabCols}
            toEnd={this.toEnd}
            deleteAll={this.deleteAll}
            editModeToggle={this.editModeToggle}
            tab={this.state.tab}
            totalTabCols={this.state.totalTabCols}
            startViewAt={this.state.startViewAt}
            atStart={this.state.atStart}
            playedNotes={this.state.playedNotes}
            playedNoteChange={this.playedNoteChange}
            addTab={this.addTab}
            editMode={this.state.editMode}
            undo={this.undo}
            redo={this.redo}
            isRedo={this.state.redoHistory.length}
            isUndo={this.state.undoHistory.length}

            
            />
        </div>


        <div className={tabDocumentClassList}>
            <TabDocument 
                changeView={this.changeView}
                changeStaffLength={this.changeStaffLength}
                tab={this.state.tab} 
                staffLength={this.state.staffLength}
                barSpacing={this.state.barSpacing}
                changeBarSpacing={this.changeBarSpacing}
                barBasedSizing={this.state.barBasedSizing}
                toggleBarBased={this.toggleBarBased}
                barBasedLength={this.state.barBasedLength}
                changeBarSizing={this.changeBarSizing}
                betweenStave={this.state.betweenStave}
                changeBetweenStave={this.changeBetweenStave}
                
                />

        </div>
        </div>
        </React.Fragment>)
    }
}

export default Fretboard