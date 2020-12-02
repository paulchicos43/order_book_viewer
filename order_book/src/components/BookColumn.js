import React from'react';
import '../css/BookColumn.css';

/**
 * A column that contains price and quantity information. Used for Bid and Ask columns in the app.
 * @param {Object} props 
 */
export default function BookColumn(props) {
    let output = props.list.map(item => (
        <div>
            <p className = "Item">
                ${ item.price.toFixed(5) } { item.quantity.toFixed(8) } ${ (item.price * item.quantity).toFixed(5) }
            </p>
        </div>
    ));

    return (
        <>
            <h3 style = { { color: 'white', } }>{ props.title }</h3>
            { output }
        </>
    );
}