import React from 'react';

// import Link from 'next/link';

import type {FormatType, View} from '../../types/common';

import styles from './FormatSelectorView.module.css';

type FormatSelectorViewProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formats: FormatType[];
    selectedFormat: FormatType;
    setSelectedFormat: React.Dispatch<React.SetStateAction<FormatType>>;
    setView: React.Dispatch<React.SetStateAction<View>>;
};

export const FormatSelectorView = ({
    formats,
    setSelectedFormat,
    selectedFormat,
    setView,
}: FormatSelectorViewProps) => {
    // const session = useSession();

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
