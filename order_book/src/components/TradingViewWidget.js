import React from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
export default function App(props) {
    return (
        <>
            <TradingViewWidget theme = { Themes.DARK } symbol = { props.symbol } />
        </>
    );
}

