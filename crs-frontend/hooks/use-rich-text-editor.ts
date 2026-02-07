"use client"

import { useState } from "react"

export function useRichTextEditor(initialContent = "") {
    const [editorContent, setEditorContent] = useState(initialContent)

    return {
        editorContent,
        setEditorContent,
    }
}
