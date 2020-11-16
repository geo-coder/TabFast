import React from 'react'
import styles from './Modal.module.css'



const Modal = (props) =>(props.show? 
    
    <div>
    
    
    <div className={styles.Modal}>
    
    
        {props.children}
    </div>
    </div>
    
    
    : null)

export default Modal