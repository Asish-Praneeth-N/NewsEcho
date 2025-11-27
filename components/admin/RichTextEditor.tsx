"use client";

import { useEffect, useRef } from "react";
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link as LinkIcon,
    Quote,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Code
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);


    // Sync external value to editor content only if empty or significantly different (simplified for now)
    // Real bidirectional binding with contentEditable is tricky. 
    // For this simple use case, we'll initialize and then rely on internal state -> onChange.
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update if the editor is empty or we really need to (e.g. initial load)
            // This prevents cursor jumping issues during typing if we were to update on every render
            if (value === '' || editorRef.current.innerHTML === '<br>') {
                editorRef.current.innerHTML = value;
            } else if (document.activeElement !== editorRef.current) {
                // If not focused, safe to update
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const ToolbarButton = ({
        icon: Icon,
        command,
        arg,
        title
    }: {
        icon: any,
        command: string,
        arg?: string,
        title: string
    }) => (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                execCommand(command, arg);
            }}
            className="p-2 rounded hover:bg-gray-200 text-gray-600 hover:text-black transition-colors"
            title={title}
        >
            <Icon className="h-4 w-4" />
        </button>
    );

    return (
        <div className="bg-white text-black rounded-xl overflow-hidden border border-white/10 flex flex-col h-80">
            {/* Toolbar */}
            <div className="bg-gray-100 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
                <ToolbarButton icon={Bold} command="bold" title="Bold" />
                <ToolbarButton icon={Italic} command="italic" title="Italic" />
                <ToolbarButton icon={Underline} command="underline" title="Underline" />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ToolbarButton icon={Heading1} command="formatBlock" arg="H1" title="Heading 1" />
                <ToolbarButton icon={Heading2} command="formatBlock" arg="H2" title="Heading 2" />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
                <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
                <ToolbarButton icon={Quote} command="formatBlock" arg="blockquote" title="Quote" />
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        const url = prompt("Enter URL:");
                        if (url) execCommand("createLink", url);
                    }}
                    className="p-2 rounded hover:bg-gray-200 text-gray-600 hover:text-black transition-colors"
                    title="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </button>
                <div className="flex-1" />
                <ToolbarButton icon={Undo} command="undo" title="Undo" />
                <ToolbarButton icon={Redo} command="redo" title="Redo" />
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                className="flex-1 p-4 overflow-y-auto outline-none prose prose-sm max-w-none"
                contentEditable
                onInput={handleInput}
                data-placeholder={placeholder}
                style={{ minHeight: '150px' }}
            />

            <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    display: block; /* For Firefox */
                }
            `}</style>
        </div>
    );
}
