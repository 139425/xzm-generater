import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = 'xzm';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined />
            </>
          ),
          href: 'https://github.com/139425',
          blankTarget: true,
        },
        {
          key: 'codeNav',
          title: '我的github主页',
          href: 'https://github.com/139425',
          blankTarget: true,
        },

      ]}
    />
  );
};
export default Footer;
