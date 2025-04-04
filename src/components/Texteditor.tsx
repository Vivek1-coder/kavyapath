'use client';

import { useState, useEffect, useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor() {
  const [content, setContent] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Ensure component is only rendered on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const apiKey = useMemo(() => process.env.NEXT_PUBLIC_TINY_MCE, []);

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <label className="block text-lg font-semibold mb-2">Content:</label>
      {isClient ? ( // Ensure it only renders on client
        <Editor
          apiKey={apiKey} // ✅ Memoized to avoid hydration issues
          value={content}
          init={{
            height: 300,
            menubar: true,
            plugins: 'advlist autolink lists link image charmap preview anchor',
            toolbar:
              'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
          }}
          onEditorChange={handleEditorChange}
        />
      ) : (
        <p>Loading editor...</p>
      )}
    </div>
  );
}
