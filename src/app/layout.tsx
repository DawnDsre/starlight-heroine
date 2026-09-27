import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '星月小女侠的知识冒险',
    template: '%s | 星月小女侠',
  },
  description:
    '用智慧守护和平！星月小女侠的知识冒险——一款融合知识答题与回合制战斗的儿童RPG游戏。',
  keywords: [
    '知识冒险',
    '儿童游戏',
    'RPG',
    '答题',
    '学习',
    '星月小女侠',
  ],
  authors: [{ name: '星月小女侠' }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
