'use client';

import ContentExplanationPopup from '@/components/AI';
import Navbar from '@/components/Navbar/Navbar';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Poem = {
  id: string;
  title: string;
  content: string;
  author: string;
};

export default function PoemPage() {
  const [speed, setSpeed] = useState(1);
  const [poem, setPoem] = useState<Poem | null>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [authorname, setAuthorname] = useState<string>('Mr. Unknown');
  const [newComment, setNewComment] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const params = useParams();
  const poemId = params?.poemId;

  const fetchPoem = async () => {
    try {
      const res = await axios.get(`/api/post/get_poem?poemId=${poemId}`);
      setPoem(res.data.poem);
      fetchAuthorName(res.data.poem.author);
    } catch (err) {
      console.error('Failed to fetch poem', err);
    }
  };

  const fetchAuthorName = async (authorId: string) => {
    try {
      const res = await axios.get(`/api/get-author?authorId=${authorId}`);
      setAuthorname(res.data.username || 'Unknown Author');
    } catch (err) {
      console.error('Failed to fetch author name', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comments/get_comments?poemId=${poemId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const getLikes = async () => {
    try {
      const response = await axios.get(`/api/post/get_likes?poemId=${poemId}`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error('Error in fetching likes', error);
    }
  };

  const likePoemInBackground = async () => {
    try {
      await axios.post(`/api/post/like_post?poemId=${poemId}`);
    } catch (error) {
      console.error('Failed to like poem in background:', error);
    }
  };

  const handleLike = () => {
    if (isLiked) return;
    setIsLiked(true);
    setLikes((prev) => prev + 1);
    toast.success('You clapped for the poem 👏');
    likePoemInBackground();
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment]);
      setNewComment('');
    }
  };

  const handleSpeak = () => {
    if (!poem || isSpeaking) return;

    const speech = new SpeechSynthesisUtterance();
    const strippedHtml = poem.content.replace(/<[^>]*>?/gm, '');
    speech.text = strippedHtml;
    speech.lang = 'hi-IN';
    speech.rate = speed;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === 'hi-IN');
    if (hindiVoice) {
      speech.voice = hindiVoice;
    }

    speech.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechRef.current = speech;
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (poemId) {
      fetchPoem();
      fetchComments();
      getLikes();
    }
  }, [poemId]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  if (!poem) return <p className="p-6 text-center">Loading poem...</p>;

  return (<div className='poem-pg absolute w-screen h-screen flex flex-col'>
    <Navbar/>
    <div className='relative w-full h-5/6 overflow-y-auto'>
    <div className='fixed top-20 right-8'>
    <ContentExplanationPopup data={poem.content}/>
    </div>
    
    <div className="max-w-3xl mx-auto h-11/12 p-6 space-y-6 bg-white shadow-lg rounded-xl mt-4 border border-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{poem.title}</h1>
        {/* <p className="text-md text-gray-500 italic">By {authorname}</p> */}
        <p className="text-md text-gray-500 italic">— प्रकृति</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-900 bg-gray-50 p-4 rounded-md border h-5/6 overflow-y-auto">
        <div dangerouslySetInnerHTML={{ __html: poem.content }} />
      </div>

      <div className="mt-6 fixed left-3 top-32 backdrop-blur-lg p-2">
        <h2 className="text-2xl font-semibold mb-3">💬 प्रतिक्रियाएँ</h2>
        <div className="space-y-3">
          {comments.length === 0 && <p className="text-gray-500">अभी तक कोई टिप्पणी नहीं है। अपनी राय सबसे पहले दें!</p>}
          {comments.map((comment, index) => (
            <div key={index} className="border border-gray-200 p-3 rounded bg-gray-100">
              {comment}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea
            className="w-full border border-gray-300 rounded p-3 resize-none focus:outline-none focus:ring focus:border-blue-300"
            placeholder="अपनी राय साझा करें..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            onClick={handleComment}
          >
            ➕ टिप्पणी
          </button>

        </div>
      </div>
      <div className="fixed bottom-1 right-1/3 flex flex-wrap gap-4 justify-center">
        <button
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            isLiked
              ? 'bg-red-600 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-red-500'
          }`}
          onClick={handleLike}
          disabled={isLiked}
        >
          👏 Clap ({likes})
        </button>

        {!isSpeaking && (
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
            onClick={handleSpeak}
          >
            🔊 कविता सुनें
          </button>
        )}

        {isSpeaking && !isPaused && (
          <button
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition"
            onClick={handlePause}
          >
            ⏸️ विराम दें
          </button>
        )}

        {isSpeaking && isPaused && (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
            onClick={handleResume}
          >
            ▶️ पुनः आरंभ करें
          </button>
        )}

        {isSpeaking && (
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
            onClick={handleStop}
          >
            ⏹️ रोकें
          </button>
        )}

        <label className='flex items-center gap-2'>
        गति: {speed.toFixed(1)}x
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
    </div>
    
  </div>

  );
}
