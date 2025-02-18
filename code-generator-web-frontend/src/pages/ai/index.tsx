import { sendMessageUsingPostUsingPost } from '@/services/backend/aiChatController';
import { PageContainer } from '@ant-design/pro-components';
import { Input, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const { TextArea } = Input;

interface Message {
  sender: 'user' | 'assistant';
  content: string;
  question?: string; // 添加问题字段
  time?: string; // 添加时间字段
}

const AiChatPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // 存储多轮对话消息
  const [inputText, setInputText] = useState('');
  const [containerHeight, setContainerHeight] = useState(0); // 对话容器高度

  useEffect(() => {
    // 设置对话容器高度，根据页面大小调整
    setContainerHeight(window.innerHeight * 0.8);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) {
      message.warning('请输入内容');
      return;
    }

    setLoading(true);

    // 将用户的消息添加到对话历史
    const currentTime = formatTimeString(new Date());
    setMessages([...messages, { sender: 'user', content: inputText, time: currentTime }]);

    try {
      const res = await sendMessageUsingPostUsingPost(inputText);
      const assistantReply = res.data || '';

      // 将机器人的回复添加到对话历史，并包含问题和时间
      setMessages([
        ...messages,
        {
          sender: 'assistant',
          content: assistantReply,
          question: inputText, // 添加问题
          time: formatTimeString(new Date()), // 添加时间
        },
      ]);
      setInputText('');
    } catch (error: any) {
      message.error('请求失败: ' + error.message);
    }

    setLoading(false);
  };

  // 时间格式化函数
  const formatTimeString = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  return (
    <PageContainer title="AI 助手">
      <div style={{ display: 'flex', flexDirection: 'column', height: '75vh' }}>
        {/* 对话展示区域 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            borderRight: '1px solid #e6e6e6',
            background: '#f5f5f5',
            maxHeight: containerHeight,
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                // 调整消息框的宽度和边距，防止显示过长
                maxWidth: '85%',
                margin: '8px 0 8px 0',
                borderRadius: 10,

                // 添加背景色和边框
                background: msg.sender === 'user' ? '#ffffff' : '#e6f7ff',
                border: msg.sender === 'user' ? '1px solid #e6e6e6' : '1px solid #91d5ff',
                padding: '12px',
              }}
            >
              {/* 添加问题显示 */}
              {msg.sender === 'assistant' && msg.question && (
                <div
                  style={{
                    background: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: 4,
                    marginTop: '4px',
                    color: '#666',
                    fontSize: '12px',
                  }}
                >
                  问题：{msg.question}
                </div>
              )}
              <br />

              <ReactMarkdown remarkPlugins={[gfm]}>{msg.content}</ReactMarkdown>

              {/* 添加时间显示 */}
              {msg.sender === 'assistant' && (
                <div
                  style={{
                    color: '#888',
                    fontSize: '11px',
                    textAlign: 'right',
                    marginTop: '4px',
                  }}
                >
                  {msg.time}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #e6e6e6',
            background: '#ffffff',
          }}
        >
          <Spin spinning={loading}>
            <TextArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请输入您的问题..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{ marginBottom: 16, width: '100%' }}
            />
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={handleSend}
                style={{
                  padding: '8px 24px',
                  margin: 8,
                  background: '#1890ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                发送
              </button>
            </div>
          </Spin>
        </div>
      </div>
    </PageContainer>
  );
};

export default AiChatPage;
