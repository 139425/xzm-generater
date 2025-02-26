import Footer from '@/components/Footer';
import { userRegisterUsingPost } from '@/services/backend/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history } from '@umijs/max';
import { message, Tabs, Button, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { Link } from 'umi';
import Settings from '../../../../config/defaultSettings';

// 人机校验的验证码图片样式配置
const fonts = [
  '28px Arial',
  '30px Verdana',
  '32px Tahoma',
  '34px Comic Sans MS',
  '30px Georgia',
  '32px Courier New',
];
const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF']; // 使用更深的颜色

const UserRegisterPage: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('<url id=\"cuusvoamisdnej840c2g\" type=\"url\" status=\"failed\" title=\"\" wc=\"0\">https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr</url>')",
      backgroundSize: '100% 100%',
    };
  });

  // CAPTCHA相关状态
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [actualCaptchaCode, setActualCaptchaCode] = useState<string>(''); // 存储实际生成的验证码
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userCaptchaInput, setUserCaptchaInput] = useState<string>('');
  const [captchaValidated, setCaptchaValidated] = useState<boolean>(false);

  // 生成4位随机验证码（包含数字和字母）
  const generateCaptchaCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // 点击“人机校验”按钮，生成验证码图片并显示模态框
  const handleCaptchaClick = () => {
    const code = generateCaptchaCode();

    // 创建canvas生成验证码图片
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 40;
    const ctx = canvas.getContext('2d')!;

    // 随机背景色
    ctx.fillStyle = '#f6f6f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 绘制验证码
    for (let i = 0; i < code.length; i++) {
      ctx.font = fonts[Math.floor(Math.random() * fonts.length)];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.textBaseline = 'middle';

      // 添加随机旋转（-10到10度）
      const angle = (Math.random() - 0.5) * 20;
      ctx.save();
      ctx.translate(20 + i * 20, 20);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillText(code[i], -5, 5);
      ctx.restore();
    }

    // 转换为DataURL
    setCaptchaCode(canvas.toDataURL());
    setActualCaptchaCode(code); // 存储实际生成的验证码
    setUserCaptchaInput('');
    setModalVisible(true);
  };

  // 确认验证码输入是否正确
  const handleCaptchaConfirm = () => {
    if (userCaptchaInput.toLowerCase() === actualCaptchaCode.toLowerCase()) {
      setCaptchaValidated(true);
      setModalVisible(false);
      message.success('人机校验成功');
    } else {
      message.error('验证码错误，请重试');
      setUserCaptchaInput('');
      handleCaptchaClick(); // 重新生成验证码
    }
  };

  // 表单提交处理函数（保持原逻辑不变）
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      await userRegisterUsingPost({
        ...values,
      });
      const defaultLoginSuccessMessage = '注册成功！';
      message.success(defaultLoginSuccessMessage);
      history.push('/user/login');
      return;
    } catch (error: any) {
      const defaultLoginFailureMessage = `注册失败，${error.message}`;
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" style={{ height: '100%' }} src="/logo.png" />}
          title="CodePulse 代码生成"
          subTitle={'代码生成器在线制作共享，大幅提升开发效率'}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          onFinish={async (values) => {
            // 在提交前检查是否通过人机校验
            if (!captchaValidated) {
              message.error('请先完成人机校验');
              return;
            }
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '新用户注册',
              },
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                ]}
              />
              {/* 添加人机校验按钮 */}
              <div style={{ marginBottom: 24 }}>
                <Button onClick={handleCaptchaClick}>
                  {captchaValidated ? '已完成人机校验' : '进行人机校验'}
                </Button>
              </div>
            </>
          )}
          <div
            style={{
              marginBottom: 24,
              textAlign: 'right',
            }}
          >
            <Link to="/user/login">老用户登录</Link>
          </div>
        </LoginForm>
        {/* 人机校验模态框 */}
        <Modal
          title="人机校验"
          visible={modalVisible}
          onOk={handleCaptchaConfirm}
          onCancel={() => setModalVisible(false)}
          okText="确认"
          cancelText="取消"
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{
              position: 'relative',
              userSelect: 'none',
              MozUserSelect: 'none',
              WebkitUserSelect: 'none'
            }}>
              {/* 显示验证码图片 */}
              <img
                src={captchaCode}
                alt="验证码"
                style={{
                  height: 40,
                  pointerEvents: 'none',
                  display: 'block',
                  marginBottom: 8
                }}
              />
              {/* 添加刷新按钮 */}
              <Button
                type="link"
                onClick={handleCaptchaClick}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0
                }}
              >
                刷新
              </Button>
            </div>
            <Input
              value={userCaptchaInput}
              onChange={(e) => setUserCaptchaInput(e.target.value)}
              onPressEnter={handleCaptchaConfirm}
              placeholder="请输入验证码"
              autoFocus
            />
          </div>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default UserRegisterPage;
