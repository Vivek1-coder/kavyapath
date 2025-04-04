'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Poem = {
  id: string;
  title: string;
  content: string;
  author: string;
};

export default function PoemPage() {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
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
      console.error('Failed to fetch poem', err);
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
      console.log('Poem liked in background');
    } catch (error) {
      console.error('Failed to like poem in background:', error);
    }
  };

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    toast.success('You liked the poem ❤️');
    likePoemInBackground();
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment]);
      setNewComment('');
      // Optionally send to backend
    }
  };

  useEffect(() => {
    if (poemId) {
      fetchPoem();
      fetchComments();
      getLikes();
    }
  }, [poemId]);

  if (!poem) return <p className="p-6">Loading poem...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{poem.title}</h1>
      <p className="text-sm text-gray-500">By {poem.author}</p>

      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: poem.content }}
      />

      <div className="flex items-center gap-4 mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleLike}
        >
          ❤️ Like ({likes})
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        <div className="space-y-2">
          {comments.length === 0 && (
            <p className="text-gray-500">No comments yet.</p>
          )}
          {comments.map((comment, index) => (
            <div key={index} className="border rounded p-2 bg-gray-50">
              {comment}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea
            className="w-full border rounded p-2"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleComment}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}
