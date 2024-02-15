import React from 'react';

// import Link from 'next/link';

import type {View} from '../../types/common';

import styles from './TemplateSelectorView.module.css';

type TemplateSelectorViewProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templatesEntries: [string, any][];
    setSelectedTemplate: React.Dispatch<React.SetStateAction<string | null>>;
    setView: React.Dispatch<React.SetStateAction<View>>;
};

export const TemplateSelectorView = ({
    templatesEntries,
    setSelectedTemplate,
    setView,
}: TemplateSelectorViewProps) => {
    // const session = useSession();

    return (
        <div className={styles.formatContainer}>
            {templatesEntries.map((template) => {
                return (
                    <button
                        key={template[0]}
                        className={styles.formatItem}
                        onClick={() => {
                            setSelectedTemplate(template[0]);
                            setView('format');
                        }}
                    >
                        {template[0]}
                    </button>
                );
            })}
        </div>
    );
};
