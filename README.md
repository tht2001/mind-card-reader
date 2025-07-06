# 心灵纸牌 - Mind Card Reader 🃏✨

一个神奇的读心术纸牌游戏，使用先进的二进制搜索算法来猜测您心中所想的纸牌。

An immersive mind-reading card game that uses advanced binary search algorithms to guess the card you're thinking of.

## ✨ 特色功能 Features

- 🎯 **精准算法** - 通过5次巧妙提问精确定位您的选择
- 📱 **响应式设计** - 完美适配PC和移动设备
- 🌍 **双语支持** - 支持中文和英文界面切换
- 🎨 **动态背景** - 炫酷的WebGL动态背景效果
- ✨ **流畅动画** - 精美的纸牌展示和揭晓动画

## 🎮 游戏步骤 How to Play

1. **选择纸牌** - 从20张纸牌中心中选择一张，并牢记它
2. **回答问题** - 系统会展示5组纸牌，每次询问是否看到您的纸牌
3. **揭晓答案** - 根据您的回答，系统将精准猜出您心中的纸牌

## 🚀 本地运行 Local Development

### 克隆项目
```bash
git clone https://github.com/your-username/mind-card-reader.git
cd mind-card-reader
```

### 启动服务器
```bash
node server.js
```

然后访问 `http://localhost:3000` 开始游戏！

## 🛠️ 技术栈 Tech Stack

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: Tailwind CSS
- **3D渲染**: Three.js + WebGL Shaders
- **API**: Deck of Cards API
- **服务器**: Node.js HTTP Server

## 📁 项目结构 Project Structure

```
mind-card-reader/
├── index.html              # 主页
├── game.html              # 游戏页面
├── dynamic-background.js   # 动态背景组件
├── server.js              # 本地服务器
├── README.md              # 项目说明
└── LICENSE.txt            # 许可证
```

## 🎯 算法原理 Algorithm

本游戏使用二进制搜索算法：
- 每张纸牌分配一个1-20的二进制值
- 通过5轮提问（基于二进制位）缩小搜索范围
- 根据用户回答构建二进制数，精确定位选择的纸牌

## 📄 许可证 License

本项目基于原始CodePen作品，遵循相应开源协议。

## 🙏 致谢 Acknowledgments

- 原始创意来自 [Matt Cannon的CodePen](https://codepen.io/matt-cannon/pen/gbOJbpZ)
- 使用 [Deck of Cards API](https://deckofcardsapi.com/) 获取纸牌图像
- 动态背景效果基于WebGL Shader技术

---

**🎭 准备好体验魔术了吗？点击开始游戏，让AI读取您的心灵！**