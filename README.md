#功能细节说明：  <br />
该项目全部代码均为我个人手写，未采用第三方库，或者借用别人的代码。

  1. **顶部通知条**  <br />
        点击顶部通知条中的“X不再提醒”后， 刷新页面不再出现此通知条。

  2. **登录**  <br />
        点击关注，弹出登录窗口，输入账户与密码，如果输入错误会有提示，登录成功后粉丝数+1，“关注”变为“取消”。
        点击取消，粉丝数-1。“取消”变为“关注”。
        如果已经登录，刷新页面后，直接进入已关注状态。

  3. **轮播图**  <br />
        每隔2s，切换一张图片。  
        所有图片无限自动循环。
        鼠标停在图片上会显示“向前”“先后”的图标，点击即可立刻滑动切换。
        录播图底部显示当前图片位置按钮，点击任意一个可以立刻切换。

  4. **课程卡片显示**  <br />
        单击“产品设计” 或 “编程语言”，使下面的显示的课程改变。
        鼠标悬停在任意课程卡片的图片上，显示该课程的详细信息。
        底部翻页导航按钮可实现：先前，先后，或跳转到显示的某个页数。

  5. **最热排行**  <br />
        每隔2秒更新一次：顶部移入一个新的课程卡片，底部移除一个课程卡片。

  6. **视频播放**  <br />
        点击“机构介绍”下面的图片，弹出视频窗口。
        鼠标悬浮在视频区域，弹出控制面板。
        控制面板区域的样式和功能，全部是我自己手写，功能和常见的视频播放差不多，包括：播放暂停、视频当前位置、缓存比例、音量控制、最大化。
  7. **屏幕自适应**  <br />
        游览器宽度小于1205px时，课程卡片由每行4列，改为每行3列。
