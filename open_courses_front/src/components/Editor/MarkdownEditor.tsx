import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css'; // Не забудьте импортировать стили KaTeX

export default function MarkdownEditor() {
    const [value, setValue] = useState<string | undefined>(
        "**Привет мир!**\n\nФормула: $E=mc^2$\n\nБлочная формула:\n$$\n\\int_0^\\infty x^2 dx\n$$"
    );

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Markdown Editor</h2>
                <p className="text-gray-600">Редактируйте контент в Markdown</p>
            </div>

            <div data-color-mode="light">
                <MDEditor
                    value={value}
                    onChange={setValue}
                    height={400}
                    previewOptions={{
                        rehypePlugins: [
                            [rehypeHighlight, { ignoreMissing: true }],
                            rehypeKatex
                        ],
                        remarkPlugins: [remarkGfm, remarkMath]
                    }}
                />
            </div>

            {/* <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Предпросмотр:</h3>
                <div className="p-4 border rounded-lg bg-white">
                    <MDEditor.Markdown
                        source={value}
                        rehypePlugins={[
                            [rehypeHighlight, { ignoreMissing: true }],
                            rehypeKatex
                        ]}
                        remarkPlugins={[remarkGfm, remarkMath]}
                    />
                </div>
            </div> */}
        </div>
    );
}