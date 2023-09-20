import React from "react";

export default function Alert(props) {
    const capitalize=(word)=>{
        const Lower=word.toLowerCase();
        return Lower.charAt(0).toUpperCase() + Lower.slice(1);
    }
  return (
    <div style={{height:'50px'}}>
    {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
      <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}  
    </div>}
    </div>
  );
}
