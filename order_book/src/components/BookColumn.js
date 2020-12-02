import React from'react';


export default function BookColumn(props) {
    
    let output = props.list.map(item => (
        <p style = { { color: props.color } }>{ item.price.toFixed(5) } { item.quantity.toFixed(8) }</p>
    ));

    return (
        <>
            { output }
        </>
    );
}