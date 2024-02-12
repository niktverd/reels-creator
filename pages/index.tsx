import React, {useState, useCallback, useEffect} from "react";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import styles from "../styles/DefaultCrop.module.css";
import {templates} from "../src/templates";

const templatesEntries = Object.entries(templates);


type FormatType = {
    name: string;
    ratio: number;
};

const formats: FormatType[] = [
    {name: '9:16', ratio: 9/16},
    {name: '10:16', ratio: 10/16},
    {name: '1:1', ratio: 1},
    {name: '16:10', ratio: 16/10},
    {name: '16:9', ratio: 16/9},
];

type FileConfig = {
    data: File;
    id: string;
    config: {
        zoom: number;
        ratio: number;
        rotation: number;
        x: number;
        y: number;
        width: number;
        height: number;
    }
};

const initialConfig: FileConfig['config'] = {
    zoom: 1,
    ratio: formats[0].ratio, 
    rotation: 0,
    x: 0,
    y: 0,
    width: 10,
    height: 10,
};

type View = 'template' | 'format' | 'files';

const Demo = () => {

    return (
        <div
            className={styles.container}
        >
            <video width={360} height={640} controls={true} src="https://firebasestorage.googleapis.com/v0/b/reels-creator-15261.appspot.com/o/Gj4FCvO8KhSNJMf1xZwX%2F20240211164628754-output.mp4?alt=media&token=56a9018a-4780-4c44-97e2-2863aed13cc8"></video>
        </div>
    );
};

export default Demo;
