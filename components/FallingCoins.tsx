
import React from 'react';
import { BtcIcon, EthIcon } from './Icons';

const COIN_COUNT = 20;

export const FallingCoins: React.FC = () => {
    const coins = Array.from({ length: COIN_COUNT }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 5}s`, // 5s to 10s duration
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 16 + 10}px` // 10px to 26px size
        };
        const Icon = Math.random() > 0.5 ? BtcIcon : EthIcon;
        return (
            <div key={i} className="coin" style={style}>
                <Icon className="w-full h-full" />
            </div>
        );
    });

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {coins}
        </div>
    );
};
