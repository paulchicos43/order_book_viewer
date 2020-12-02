import React from'react';


export default function BookColumn(props) {
    let output = props.list.map(item => (
        <p>{ item.price } { item.quantity }</p>
    ));

    return (
        <div style = { { display: 'inline-block' } }>
            { output }
        </div>
    );
}