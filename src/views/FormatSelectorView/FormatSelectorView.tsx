import React from 'react';

import {formats} from '../../constants/common';
import {useFormatContext} from '../../contexts/formatContext';
import type {View} from '../../types/common';

import styles from './FormatSelectorView.module.css';

type FormatSelectorViewProps = {
    setView: React.Dispatch<React.SetStateAction<View>>;
};

export const FormatSelectorView = ({setView}: FormatSelectorViewProps) => {
    const {selectedFormat, setSelectedFormat} = useFormatContext();

    return (
        <div className={styles.formatContainer}>
            {formats.map((f, index) => {
                return (
                    <button
                        key={f.name + index}
                        style={{
                            backgroundColor:
                                f.name === selectedFormat?.name ? 'lightcoral' : 'inherit',
                        }}
                        className={styles.formatItem}
                        onClick={() => {
                            setSelectedFormat(f);
                            setView('files');
                        }}
                    >
                        {f.name}
                    </button>
                );
            })}
        </div>
    );
};
