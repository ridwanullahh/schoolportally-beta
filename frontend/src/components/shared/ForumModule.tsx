import React, { useState, useEffect, useRef } from 'react';
import sdk from '../../lib/sdk-config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';

const ForumModule = ({ schoolId, subjectId }) => {
  const [threads, setThreads] = useState([]);
  const [posts, setPosts] = useState({});
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const unsubscribeThreadsRef = useRef(null);
  const unsubscribePostsRef = useRef(null);

  useEffect(() => {
    if (schoolId && subjectId) {
      fetchThreads();
      subscribeToThreads();
    }

    return () => {
      if (unsubscribeThreadsRef.current) {
        unsubscribeThreadsRef.current();
      }
    };
  }, [schoolId, subjectId]);

  useEffect(() => {
    if (selectedThread) {
      fetchPosts(selectedThread.id);
      subscribeToPosts(selectedThread.id);
    }

    return () => {
      if (unsubscribePostsRef.current) {
        unsubscribePostsRef.current();
      }
    };
  }, [selectedThread]);

  const fetchThreads = async () => {
    const res = await sdk.get('forum_threads');
    setThreads(res.filter(t => t.schoolId === schoolId && t.subjectId === subjectId));
  };

  const fetchPosts = async (threadId) => {
    const res = await sdk.get('forum_posts');
    setPosts((prev) => ({ ...prev, [threadId]: res.filter(p => p.threadId === threadId) }));
  };

  const subscribeToThreads = () => {
    unsubscribeThreadsRef.current = sdk.subscribe(
      'forum_threads',
      (newThreads) => setThreads(newThreads.filter(t => t.schoolId === schoolId && t.subjectId === subjectId))
    );
  };

  const subscribeToPosts = (threadId) => {
    unsubscribePostsRef.current = sdk.subscribe('forum_posts', (newPosts) => {
      setPosts((prev) => ({ ...prev, [threadId]: newPosts.filter(p => p.threadId === threadId) }));
    });
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle) return;
    await sdk.insert('forum_threads', {
      schoolId,
      subjectId,
      title: newThreadTitle,
      userId: user.id,
      status: 'open',
      sticky: false,
    });
    setNewThreadTitle('');
  };

  const handleCreatePost = async (threadId) => {
    if (!newPostContent) return;
    await sdk.insert('forum_posts', {
      threadId,
      userId: user.id,
      content: newPostContent,
      status: 'visible'
    });
    setNewPostContent('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forum</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedThread ? (
          <div>
            <div className="flex gap-2 mb-4">
              <Input
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="New Thread Title"
              />
              <Button onClick={handleCreateThread}>Create Thread</Button>
            </div>
            <div className="space-y-2">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 border rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedThread(thread)}
                >
                  <h4 className="font-bold">{thread.title}</h4>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Button onClick={() => setSelectedThread(null)} className="mb-4">
              &larr; Back to Threads
            </Button>
            <h3 className="text-xl font-bold mb-2">{selectedThread.title}</h3>
            <div className="space-y-4">
              {(posts[selectedThread.id] || []).map((post) => (
                <div key={post.id} className="p-4 border rounded">
                  <p>{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    By: {post.userId}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Write a reply..."
              />
              <Button onClick={() => handleCreatePost(selectedThread.id)}>Post</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForumModule;