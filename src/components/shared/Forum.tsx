import React, { useState, useEffect, useRef } from 'react';
import sdk from '@/lib/sdk-config';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Send, MessageSquare, ThumbsUp, Reply } from 'lucide-react';

const Forum = ({ scopeId, scopeType }) => { // scopeType can be 'class' or 'subject'
    const { user } = useAuth();
    const [threads, setThreads] = useState([]);
    const [posts, setPosts] = useState({});
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedThread, setSelectedThread] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

    useEffect(() => {
        if (scopeId) {
            const unsubscribe = sdk.subscribe('forum_threads', (allThreads) => {
                setThreads(allThreads.filter(t => t[scopeType+'Id'] === scopeId));
            });
            return () => unsubscribe();
        }
    }, [scopeId, scopeType]);

    useEffect(() => {
        if (selectedThread) {
            const unsubscribe = sdk.subscribe('forum_posts', (allPosts) => {
                setPosts(prev => ({...prev, [selectedThread.id]: allPosts.filter(p => p.threadId === selectedThread.id)}));
            });
            return () => unsubscribe();
        }
    }, [selectedThread]);

    const handleCreateThread = async () => {
        if (!newThreadTitle) return;
        await sdk.insert('forum_threads', {
            [scopeType+'Id']: scopeId,
            schoolId: user.schoolId,
            title: newThreadTitle,
            userId: user.id,
            status: 'open',
            sticky: false,
        });
        setNewThreadTitle('');
    };

    const handleCreatePost = async () => {
        if (!newPostContent) return;
        await sdk.insert('forum_posts', {
            threadId: selectedThread.id,
            userId: user.id,
            content: newPostContent,
            parentId: replyingTo,
            status: 'visible'
        });
        setNewPostContent('');
        setReplyingTo(null);
    };
    
    const handleReaction = async (postId, reaction) => {
        const post = posts[selectedThread.id].find(p => p.id === postId);
        const currentReactions = post.reactions || {};
        const newReactions = {...currentReactions, [reaction]: (currentReactions[reaction] || 0) + 1};
        await sdk.update('forum_posts', postId, { reactions: newReactions });
    }

    // A more modern UI will be built here, this is a starting point
    return (
       <div className="flex h-full bg-gray-100">
           <div className="w-1/3 border-r">
               <div className="p-4 border-b flex gap-2">
                   <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search threads..." />
               </div>
               <div className="p-4 border-b flex gap-2">
                   <Input value={newThreadTitle} onChange={e => setNewThreadTitle(e.target.value)} placeholder="Start a new thread" />
                   <Button onClick={handleCreateThread}>Create</Button>
               </div>
               <div className="overflow-y-auto">
                   {threads.filter(thread => thread.title.toLowerCase().includes(searchTerm.toLowerCase())).map(thread => (
                       <div key={thread.id} className={`p-4 cursor-pointer hover:bg-gray-200 ${selectedThread?.id === thread.id ? 'bg-gray-200' : ''}`} onClick={() => setSelectedThread(thread)}>
                           <p className="font-semibold">{thread.title}</p>
                       </div>
                   ))}
               </div>
           </div>
           <div className="flex-1 flex flex-col">
               {selectedThread ? (
                   <>
                       <div className="p-4 border-b flex items-center">
                           <h2 className="text-xl font-bold">{selectedThread.title}</h2>
                       </div>
                       <div className="flex-1 p-4 overflow-y-auto">
                           {(posts[selectedThread.id] || []).map(post => (
                               <div key={post.id} className={`flex mb-4 ${post.userId === user.id ? 'justify-end' : ''}`}>
                                   <div className={`p-2 rounded-lg ${post.userId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                                       <p>{post.content}</p>
                                      <div className="flex gap-2 mt-1">
                                          <Button size="sm" variant="ghost" onClick={() => handleReaction(post.id, 'thumbsUp')}><ThumbsUp size={16} /> {post.reactions?.thumbsUp || 0}</Button>
                                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(post.id)}><Reply size={16} /></Button>
                                      </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                       <div className="p-4 border-t flex gap-2">
                          {replyingTo && <p className="text-sm text-gray-500">Replying to {posts[selectedThread.id].find(p=>p.id === replyingTo)?.userId}</p>}
                           <Input value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="Type a message" />
                           <Button onClick={handleCreatePost}><Send /></Button>
                       </div>
                   </>
               ) : (
                   <div className="flex-1 flex items-center justify-center">
                       <p className="text-gray-500">Select a thread to start chatting</p>
                   </div>
               )}
           </div>
       </div>
    )
}

export default Forum;