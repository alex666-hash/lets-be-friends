import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { messageAPI, userAPI } from '../utils/api';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Messages = () => {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadMessages();
    }
  }, [selectedMatch]);

  const loadMatches = async () => {
    try {
      // In a real app, fetch matches from API
      setMatches([]);
    } catch (error) {
      toast.error('Failed to load matches');
    }
  };

  const loadMessages = async () => {
    try {
      const response = await messageAPI.getMessages(selectedMatch._id);
      setMessages(response.data.messages);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await messageAPI.sendMessage({
        recipientId: selectedMatch._id,
        content: newMessage
      });
      setMessages([...messages, response.data.data]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      if (error.response?.data?.violations) {
        toast.error('Message contains prohibited content');
      } else {
        toast.error(error.response?.data?.message || 'Failed to send message');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await messageAPI.deleteMessage(messageId);
      setMessages(messages.filter(m => m._id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-6xl mx-auto h-screen flex gap-4 p-4">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-dark mb-4">Messages</h2>
          {matches.length === 0 ? (
            <p className="text-gray-500">No matches yet</p>
          ) : (
            <div className="space-y-2">
              {matches.map((match) => (
                <button
                  key={match._id}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedMatch?._id === match._id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-semibold">{match.firstName}</p>
                  <p className="text-sm opacity-75">Last active</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 bg-white rounded-lg shadow-lg flex flex-col">
          {selectedMatch ? (
            <>
              {/* Header */}
              <div className="border-b p-4">
                <h3 className="text-lg font-bold text-dark">{selectedMatch.firstName}</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex gap-2 ${
                      msg.sender._id === user._id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender._id === user._id
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-dark'
                      }`}
                    >
                      {msg.isFlagged && (
                        <p className="text-sm font-semibold mb-1">⚠️ Flagged for content</p>
                      )}
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.sender._id === user._id && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  <FiSend /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a match to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
