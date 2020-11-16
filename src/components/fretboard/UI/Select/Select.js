import React from 'react'


const Select = (props) =>{

let optionsList=props.optionsList.map(opt=><option key={props.string+'-'+opt.value} value={opt.value}>{opt.display}</option>)

    return (
    <select value={props.value} style={props.style} onChange={(e) => props.changeHandle(e, props.string)}>
        {optionsList}

    </select>)
}

export default Select