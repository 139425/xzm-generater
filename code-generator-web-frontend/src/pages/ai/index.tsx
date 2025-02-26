import { sendMessageUsingPost } from '@/services/backend/aiChatController';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Input, message, Spin, Form, Select, Slider } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const { TextArea } = Input;

interface Message {
  sender: 'user' | 'assistant';
  content: string;
  time?: string;
}

interface SendParams {
  frequencyPenalty: number;
  maxToken: number;
  message: string;
  model: string;
  role: number;
  temperature: number;
  topK: number;
  topP: number;
}

const AiChatPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // 存储历史问答和当前问题
  const [inputText, setInputText] = useState('');
  const [containerHeight, setContainerHeight] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // 定义参数的默认值和范围
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [maxToken, setMaxToken] = useState(600);
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(10);
  const [topP, setTopP] = useState(0.9);
  const [role, setRole] = useState(1); // 默认为用户角色
  const [model, setModel] = useState('Qwen/Qwen2.5-7B-Instruct'); // 新增模型选择 state

  const [form] = Form.useForm();
  const clearMessagesTimer = useRef<NodeJS.Timeout | null>(null); // 用于存储定时器引用

  // 表单校验消息
  const validateMessages = {
    frequencyPenalty: '无效的值！请输入-2到2之间的数字。',
    maxToken: '无效的值！请输入1到4096之间的整数。',
    temperature: '无效的值！请输入0到2之间的浮点数，精度0.1。',
    topK: '无效的值！请输入1到100之间的整数。',
    topP: '无效的值！请输入0到1之间的浮点数，精度0.1。',
  };

  useEffect(() => {
    setContainerHeight(window.innerHeight * 0.8);

    // 启动定时器，每隔15分钟清空消息数组
    clearMessagesTimer.current = setInterval(() => {
      setMessages([]);
      console.log('消息数组已清空');
    }, 15 * 60 * 1000); // 15 minutes

    // 组件卸载时清除定时器
    return () => {
      if (clearMessagesTimer.current) {
        clearInterval(clearMessagesTimer.current);
      }
    };

    // 检查协议是否为 HTTPS 或 localhost
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.warn('复制功能需要在 HTTPS 协议或本地环境下才能正常工作');
      message.warning('复制功能需要在 HTTPS 协议或本地环境下才能正常工作');
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }

    try {
      form.validateFields();

      setLoading(true);

      const currentTime = formatTimeString(new Date());
      const userMessage = { sender: 'user', content: inputText, time: currentTime };

      // 更新消息列表，保留最多 maxToken 条
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, userMessage];
        if (newMessages.length > maxToken) {
          return newMessages.slice(newMessages.length - maxToken);
        }
        return newMessages;
      });

      // 构建完整的 message 发送给后端，包括历史问答和当前问题
      const history = messages
        .slice(0, messages.length - 1) // 排除当前问题
        .map((msg) => (msg.sender === 'user' ? `用户: ${msg.content}` : `助手: ${msg.content}`))
        .join('\n');
      const fullMessage = `${history}\n基于上面问答回答下面问题，问题：\n${inputText}`;

      // 构建请求对象，新增 model 参数
      const request: SendParams = {
        frequencyPenalty,
        maxToken,
        message: fullMessage,
        model,
        role,
        temperature,
        topK,
        topP,
      };

      console.log(request);

      const res = await sendMessageUsingPost(request);
      const assistantReply = res.data || '';

      // 更新消息列表，包括助手的回复
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { sender: 'assistant', content: assistantReply, time: formatTimeString(new Date()) }
        ];
        if (newMessages.length > maxToken) {
          return newMessages.slice(newMessages.length - maxToken);
        }
        return newMessages;
      });

      setInputText('');

      // 自动滑到底部
      const container = document.querySelector('.chat-container');
      container?.scrollTo(0, container.scrollHeight);
    } catch (error) {
      message.error('服务器繁忙，请更换模型或稍后再试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeString = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  // 将 handleCopyForMsg 方法改造成兼容 HTTPS 和旧浏览器的形式
  const handleCopyForMsg = (content: string) => {
    // 定义回退方法
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';  // 避免滚动条跳动
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        message.success('已复制到剪贴板');
      } catch (err) {
        message.error('复制失败，请手动选择文本复制');
        console.error('Fallback copy error:', err);
      } finally {
        document.body.removeChild(textArea);
      }
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(content)
        .then(() => message.success('已复制到剪贴板'))
        .catch((err) => {
          console.error('Clipboard API error:', err);
          fallbackCopy(content);
        });
    } else {
      fallbackCopy(content);
    }
  };

  const handleRegenerateForMsg = async (userMessage: string) => {
    setInputText(userMessage);
    await handleSend();
  };

  return (
    <PageContainer title="AI 助手">
      <div
        className="chat-container"
        style={{ display: 'flex', flexDirection: 'column', height: '82vh' }}
      >
        {/* 对话展示区域 */}
        <div
          style={{

            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            borderRight: '1px solid #e6e6e6',
            background: '#f5f5f5',
            maxHeight: '1000px',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{

                display: 'flex',
                flexDirection: 'column',
                maxWidth: '90%',
                margin: '8px auto',
                borderRadius: 10,
                padding: '12px',
                position: 'relative',
                backgroundColor: '#ffffff',
                border: '1px solid #e6e6e6',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.time && (
                <div
                  style={{

                    color: '#888',
                    fontSize: '11px',
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                  }}
                >
                  {msg.time}
                </div>
              )}

              <div
                style={{

                  background: msg.sender === 'user' ? '#ffffff' : '#e6f7ff',
                  padding: '12px',
                  borderRadius: 6,
                  color: '#333',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  width: '100%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 8 }}>
                  {msg.sender === 'user' ? '' : ''}
                </div>
                <ReactMarkdown remarkPlugins={[gfm]}>{msg.content}</ReactMarkdown>
              </div>

              {/* 复制和重新生成按钮 */}
              {msg.sender === 'assistant' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Button
                    type="primary"
                    style={{ margin: '0 8px' }}
                    onClick={() => handleCopyForMsg(msg.content)}
                  >
                    复制
                  </Button>
                  <Button
                    type="default"
                    style={{ margin: '0 8px' }}
                    onClick={() => {
                      const userMsg = messages.findLast(
                        (m) => m.sender === 'user' && m.time === msg.time
                      );
                      if (userMsg) {
                        handleRegenerateForMsg(userMsg.content);
                      } else {
                        message.warning('找不到对应问题');
                      }
                    }}
                  >
                    重新编辑
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        <div style={{ padding: '16px', borderTop: '1px solid #e6e6e6', background: '#ffffff' }}>
          <Spin spinning={loading}>
            {/* 控制表单显示的按钮 */}
            <Button
              style={{ marginBottom: '16px', marginRight: '8px' }}
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              {isFormVisible ? '隐藏参数配置' : '显示参数配置'}
            </Button>

            {/* 模型选择按钮 */}
            <Select
              style={{ width: 300, marginBottom: '16px' }}
              value={model}
              listHeight={7056}
              onChange={(value) => setModel(value)}
              options={[
                { label: 'Qwen2.5-7B-Instruct', value: 'Qwen/Qwen2.5-Coder-7B-Instruct' },
                { label: 'DeepSeek-R1满血版(卡)', value: 'deepseek-ai/DeepSeek-R1' },
                { label: 'DeepSeek-R1-70b', value: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B' },
                { label: 'DeepSeek-V3', value: 'deepseek-ai/DeepSeek-V3' },
                { label: 'DeepSeek-R1-Distill-Qwen-14B', value: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B' },
                { label: 'DeepSeek-R1-Distill-Qwen-7B', value: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B' },
                { label: 'DeepSeek-R1-Distill-Llama-8B', value: 'deepseek-ai/DeepSeek-R1-Distill-Llama-8B' },
                { label: 'TeleChat2（中国电信）', value: 'TeleAI/TeleChat2' },
                { label: 'Yi-1.5-9B-Chat-16K（01万物）', value: '01-ai/Yi-1.5-9B-Chat-16K' },
                { label: 'Qwen/QwQ-32B-Preview', value: 'Qwen/QwQ-32B-Preview' },
                { label: 'Qwen/Qwen2.5-7B-Instruct', value: 'Qwen/Qwen2.5-7B-Instruct' },
                { label: 'Meta-Llama-3.1-8B-Instruct（Meta）', value: 'meta-llama/Meta-Llama-3.1-8B-Instruct' },
                { label: 'glm-4-9b-chat（智谱）', value: 'THUDM/glm-4-9b-chat' },
                { label: 'chatglm3-6b（智谱）', value: 'THUDM/chatglm3-6b' },
                { label: 'gemma-2-9b-it（google）', value: 'google/gemma-2-9b-it' },
                { label: 'AIDC-AI/Marco-o1（阿里巴巴MarcoPolo）', value: 'AIDC-AI/Marco-o1' },
                { label: 'internlm/internlm2_5-20b-chat', value: 'internlm/internlm2_5-20b-chat' },
                { label: 'internlm/internlm2_5-7b-chat', value: 'internlm/internlm2_5-7b-chat' },
              ]}
            />
            <h5>适当调整最大Token以保证回答完整性，刷新可以重置配置与对话^^</h5>
            {/* 模型参数配置表单 */}
            {isFormVisible && (
              <Form
                form={form}
                name="modelParameters"
                title="模型参数配置"
                initialValues={{
                  frequencyPenalty: 0.0,
                  maxToken: 1200,
                  temperature: 0.7,
                  topK: 10,
                  topP: 0.9,
                  role: 1,
                }}
                validateMessages={validateMessages}
                layout="vertical"
                style={{ width: '100%', marginBottom: '16px' }}
              >
                {/* 角色选择下拉框 */}
                <Form.Item
                  name="role"
                  label="角色"
                  rules={[{ required: true, message: '请选择角色!' }]}
                >
                  <Select
                    value={role}
                    onChange={(value) => setRole(value)}
                    options={[
                      { label: '用户', value: 1 },
                      { label: '助手', value: 2 },
                      { label: '系统', value: 3 },
                    ]}
                  />
                </Form.Item>

                {/* 滑动条参数 */}
                <Form.Item name="maxToken" label="最大Token (1 ↔️ 4096)">
                  <Slider
                    value={maxToken}
                    onChange={(value) => setMaxToken(value)}
                    min={1}
                    max={4096}
                    step={1}
                  />
                  <div style={{ marginTop: '8px' }}>{maxToken}</div>
                </Form.Item>
                <Form.Item name="temperature" label="回答随机性 (0 ↔️ 2)">
                  <Slider
                    value={temperature}
                    onChange={(value) => setTemperature(value)}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                  <div style={{ marginTop: '8px' }}>{temperature}</div>
                </Form.Item>
                <br />
                <h4><hr></hr>以下三个参数均与回答灵活性成正比，稳定性成反比，具体细节参见硅基流动官网   </h4>
                <br />
                <br />
                <Form.Item name="topK" label="Top-K (1 ↔️ 100)">
                  <Slider
                    value={topK}
                    onChange={(value) => setTopK(value)}
                    min={1}
                    max={100}
                    step={1}
                  />
                  <div style={{ marginTop: '8px' }}>{topK}</div>
                </Form.Item>
                <Form.Item name="topP" label="Top-P (0 ↔️ 1)">
                  <Slider
                    value={topP}
                    onChange={(value) => setTopP(value)}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  <div style={{ marginTop: '8px' }}>{topP}</div>
                </Form.Item>
                <Form.Item name="frequencyPenalty" label="频率惩罚 (-2 ↔️ 2)">
                  <Slider
                    value={frequencyPenalty}
                    onChange={(value) => setFrequencyPenalty(value)}
                    min={-2}
                    max={2}
                  />
                  <div style={{ marginTop: '8px' }}>{frequencyPenalty}</div>
                </Form.Item>
              </Form>
            )}

            {/* 输入框和发送按钮 */}
            <div>
              <TextArea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请输入您的问题..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{ width: '99%' }}
              />
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <Button
                  type="primary"
                  disabled={loading}
                  onClick={handleSend}
                  style={{

                    padding: '8px 24px',
                    background: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  发送
                </Button>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </PageContainer>
  );
};

export default AiChatPage;
