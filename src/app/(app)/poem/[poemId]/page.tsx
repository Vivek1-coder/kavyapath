'use client';

import ContentExplanationPopup from '@/components/AI';
import Navbar from '@/components/Navbar/Navbar';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type Poem = {
  id: string;
  title: string;
  content: string;
  author: string;
};

type Comment = {
  _id: string;
  content: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
};

export default function PoemPage() {
  const [speed, setSpeed] = useState(1);
  const [poem, setPoem] = useState<Poem | null>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const params = useParams();
  const poemId = params?.poemId;

  const fetchPoem = async () => {
    try {
      const res = await axios.get(`/api/post/get_poem?poemId=${poemId}`);
      setPoem(res.data.poem);
    } catch (err) {
      console.error('Failed to fetch poem', err);
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

  const handleComment = async () => {
    if (newComment.trim()) {
      setIsSubmittingComment(true);
      try {
        // Transliterate English to Hindi
        let transliteratedComment = newComment;
        
        // Check if comment contains English characters (basic check)
        const hasEnglish = /[a-zA-Z]/.test(newComment);
        
        if (hasEnglish) {
          try {
            const transliterateResponse = await axios.post('/api/transliterate', {
              romanText: newComment,
            });
            transliteratedComment = transliterateResponse.data.hindi;
          } catch (transliterateError) {
            console.log('Transliteration failed, using original text:', transliterateError);
            // If transliteration fails, use original comment
          }
        }

        const response = await axios.post(`/api/comments/create_comments?poemId=${poemId}`, {
          content: transliteratedComment,
        });
        
        if (response.data.success) {
          toast.success('टिप्पणी सफलतापूर्वक जोड़ी गई!');
          setNewComment('');
          // Refresh comments to get the latest list
          fetchComments();
        }
      } catch (error) {
        console.error('Failed to post comment:', error);
        toast.error('टिप्पणी पोस्ट करने में त्रुटि हुई');
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  const handleSpeak = () => {
    if (!poem || isSpeaking) return;

    const speech = new SpeechSynthesisUtterance();
    const strippedHtml = poem.content.replace(/<[^>]*>?/gm, '');
    speech.text = strippedHtml;
    speech.lang = 'hi-IN';
    speech.rate = speed;

    const hindiVoice = voices.find((v) => v.lang === 'hi-IN') || voices.find(v => v.lang.startsWith('hi'));
    if (hindiVoice) {
      speech.voice = hindiVoice;
    } else {
      console.warn('Hindi voice not available. Default voice will be used.');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poemId]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  if (!poem) return <div className="p-6 flex justify-center"><Loader className='animate-spin'/></div>;

  return (
    <div className='poem-pg absolute w-screen h-screen flex flex-col'>
      <Navbar/>
      <div className='relative w-full h-5/6 overflow-y-auto'>
        <div className='fixed top-20 right-8'>
          <ContentExplanationPopup data={poem.content}/>
        </div>

        <div className="max-w-3xl mx-auto h-11/12 p-6 space-y-6 bg-white shadow-lg rounded-xl mt-4 border border-gray-200">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{poem.title}</h1>
            <p className="text-md text-gray-500 italic">— प्रकृति</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-900 bg-gray-50 p-4 rounded-md border h-5/6 overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: poem.content }} />
          </div>

          <div className="mt-6 fixed left-3 top-32 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                💬 प्रतिक्रियाएँ
                <span className="text-sm font-normal bg-red-800/20 px-2 py-1 rounded-full">
                  {comments.length}
                </span>
              </h2>
            </div>

            {/* Comments List */}
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
              {comments.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-3">💭</div>
                  <p className="text-gray-500 text-sm">
                    अभी तक कोई टिप्पणी नहीं है।<br />
                    अपनी राय सबसे पहले दें!
                  </p>
                </div>
              )}
              {comments.map((comment) => (
                <div 
                  key={comment._id} 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {comment.userId?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-red-700 mb-1">
                        {comment.userId?.name || 'Anonymous'}
                      </p>
                      <p className="text-gray-800 text-sm leading-relaxed break-words">
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {new Date(comment.createdAt).toLocaleDateString('hi-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <textarea
                className="w-full border-2 border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm bg-white shadow-sm"
                placeholder="अपनी राय साझा करें... 💭"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmittingComment}
              />
              <p className="text-xs text-gray-500 mt-1 mb-2">
                ✨ English में लिखें, Hindi में convert होगा
              </p>
              <button
                className="w-full px-4 py-2.5 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500 hover:from-yellow-700 hover:to-red-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                onClick={handleComment}
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? (
                  <>
                    <Loader className="animate-spin h-4 w-4" />
                    अनुवाद हो रहा है...
                  </>
                ) : (
                  <>
                    <span className="text-lg ">➕</span>
                    टिप्पणी जोड़ें
                  </>
                )}
              </button>
            </div>
          </div>

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #dc2626, #f97316);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #b91c1c, #ea580c);
            }
          `}</style>

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
