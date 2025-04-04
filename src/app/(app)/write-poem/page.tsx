'use client';

import TextEditor from '@/components/Texteditor';
import { useState, useEffect, useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import TranslatedPoem from '@/components/TranslatedPoem';

export default function PoemSubmissionPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleTransliterate = async () => {
    setLoading(true);
    try {
      // Create a temporary element to manipulate HTML content
      const tempElement = document.createElement('div');
      tempElement.innerHTML = content; // 'content' contains the HTML from the editor
  
      // Function to traverse and transliterate only text nodes
      const transliterateNodes = async (node: ChildNode) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          const res = await fetch('/api/transliterate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ romanText: node.textContent }),
          });
  
          const data = await res.json();
          node.textContent = data.hindi || node.textContent; // Preserve original if error occurs
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          for (const child of Array.from(node.childNodes)) {
            await transliterateNodes(child); // Recursive call for child nodes
          }
        }
      };
  
      // Process each text node inside the tempElement
      await transliterateNodes(tempElement);
  
      // Update the translated content while preserving HTML tags
      setTranslatedContent(tempElement.innerHTML);
    } catch (err) {
      console.error('Error transliterating:', err);
    }
    setLoading(false);
  };
  
  const handleSubmit = async () => {
    // handle storing in DB here (e.g., via another /api/submit-poem)
    setLoading2(true);
    try {
        await handleTransliterate();
        
        const response = await axios.post('api/post/create_post', {
          title,
          content:translatedContent,
          category
        });
    
        alert('Poem submitted!\n' + response.data.message);
    } catch (error) {
        alert('Error!\n' + error);
    }
    finally{
        setLoading2(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  const apiKey = useMemo(() => process.env.NEXT_PUBLIC_TINY_MCE, []);

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">कविता लिखें (Write a Poem)</h1>

      <div>
        <label className="block text-sm font-medium">Title (शीर्षक)</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Content (Roman Hindi)</label>
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
      </div>

      <div>
        <label className="block text-sm font-medium">Category (वर्ग)</label>
        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="prem">प्रेम</option>
          <option value="virah">विरह</option>
          <option value="deshbhakti">देशभक्ति</option>
          <option value="anubhav">अनुभव</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleTransliterate}
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert to Hindi'}
      </button>

      {translatedContent && (
        <div className="mt-4 p-4 bg-gray-100 rounded border">
          <h2 className="text-xl font-semibold mb-2">अनुवादित कविता (Translated Poem)</h2>
          <TranslatedPoem translatedContent={translatedContent}/>
        </div>
      )}

      <button
        className="bg-green-600 text-white px-4 py-2 rounded "
        onClick={handleSubmit}
        disabled={!translatedContent}
      >
        {!translatedContent ?"Loading...": loading2 ? "Submitting":"Submit"} 
      </button>
    </main>
  );
}
