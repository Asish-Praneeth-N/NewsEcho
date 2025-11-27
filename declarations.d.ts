declare module 'react-quill' {
    import React from 'react';
    export interface ReactQuillProps {
        theme?: string;
        modules?: any;
        formats?: string[];
        value?: string;
        onChange?: (value: string) => void;
        placeholder?: string;
        className?: string;
        children?: React.ReactNode;
    }
    export default class ReactQuill extends React.Component<ReactQuillProps> { }
}
