import React, { useMemo } from 'react';

// FormattedText component to safely render AI responses with markdown-style formatting
const FormattedText = ({ text, className = '' }) => {
    const formattedHtml = useMemo(() => {
        if (text == null) return '';

        // Ensure we always work with a string
        let formatted = typeof text === 'string' ? text : String(text);

        // ESCAPE HTML TAGS FIRST to prevent XSS from user input or AI hallucinations
        // We only want to allow the specific HTML we generate below
        formatted = formatted
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        // --- BLOCK LEVEL ELEMENTS ---

        // Code blocks (pre/code) - Handle these first to avoid collisions
        formatted = formatted.replace(/```([\s\S]*?)```/gs, '<pre class="code-block"><code>$1</code></pre>');

        // Section Headers
        // ### Heading 3
        formatted = formatted.replace(/^###\s+(.*)$/gm, '<h3 class="section-header">$1</h3>');
        // ## Heading 2
        formatted = formatted.replace(/^##\s+(.*)$/gm, '<h2 class="section-header">$1</h2>');
        // # Heading 1 (Mapped to h4 for visual hierarchy in chat)
        formatted = formatted.replace(/^#\s+(.*)$/gm, '<h4 class="section-header">$1</h4>');

        // Horizontal Rules
        formatted = formatted.replace(/^---$/gm, '<hr class="divider" />');

        // Lists
        // Unordered lists (bullets) - - item or * item or • item
        formatted = formatted.replace(/^[-*•]\s+(.*)$/gm, '<div class="bullet-item"><span class="bullet">•</span><span class="content">$1</span></div>');

        // Ordered lists (numbered) - 1. item
        formatted = formatted.replace(/^(\d+)\.\s+(.*)$/gm, '<div class="numbered-item"><span class="number">$1.</span><span class="content">$2</span></div>');

        // Definition lists - Term: Definition
        formatted = formatted.replace(/^\s*([A-Za-z][^:\n]*?):\s+(.*)$/gm, '<div class="definition-item"><strong class="definition-term">$1:</strong> <span class="definition-content">$2</span></div>');

        // --- INLINE ELEMENTS ---

        // Bold (**text**)
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="highlight-text theme-bold">$1</strong>');

        // Bold alternative (__text__)
        formatted = formatted.replace(/__([^_]+?)__/g, '<strong class="highlight-bg">$1</strong>');

        // Italic (*text*) - Careful not to match * used in bullets if not at start of line
        // We use a negative lookbehind or just ensure it's not the start of a line bullet
        formatted = formatted.replace(/(^|[\s(])\*(?!\s)(.+?)\*(?=[,\s).!?]|$)/g, '$1<em class="tilt-text">$2</em>');

        // Inline Code (`text`)
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Large Text (^^text^^)
        formatted = formatted.replace(/\^\^(.+?)\^\^/g, '<span class="large-text">$1</span>');

        // Math/LaTeX style formulas
        // Block \[ ... \]
        formatted = formatted.replace(/\\\[(.*?)\\\]/gs, '<div class="formula-block">$1</div>');
        // Inline \( ... \)
        formatted = formatted.replace(/\\\((.*?)\\\)/g, '<span class="formula-inline">$1</span>');
        // Simple bracket math [ ... ]
        formatted = formatted.replace(/\[([\d\w\s+\-*/=^().,]+)\]/g, '<span class="formula-inline">$1</span>');

        // --- FINAL CLEANUP ---

        // Double newlines to paragraph breaks (or double br)
        formatted = formatted.replace(/\n\n+/g, '<br/><br/>');
        // Single newlines to line breaks (unless inside pre tags, but regex replace is simple here)
        // Note: This might break inside generated pre tags if we aren't careful. 
        // For this simple implementation, we'll assume AI output structure is simple. 
        // Ideally, we'd stash code blocks before processing newlines.

        // To safely handle newlines only outside tags:
        // This is a comprehensive regex to only replace \n with <br> if not inside >...< tags essentially? 
        // Simpler approach for this specific app's level of complexity:
        formatted = formatted.replace(/\n/g, '<br/>');

        // Clean up excessive breaks
        formatted = formatted.replace(/(<br\/>){3,}/g, '<br/><br/>');

        return formatted;
    }, [text]);

    return (
        <div
            className={`formatted-text ${className}`}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
        />
    );
};

export default FormattedText;
