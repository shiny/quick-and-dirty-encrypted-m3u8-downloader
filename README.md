# Quick and Dirty Encrypted m3u8 Downloader

老子买的课程，一定要我在 App 上看，老子不乐意

写了个简单的工具，下载 m3u8，解密，并且导出合并后的 ts

老子不传播盗版，但是别拦着我在不同设备上看

---

由于是 Quick and Dirty，不一定适用你，条件：

- 必须是 AES 128 加密算法
- 文件中带 key 的绝对地址
- iv 符合格式
- 没有做反爬虫 / cookie 验证措施

跑不跑得起来看缘分

---
安装

`npm i -g quick-and-dirty-encrypted-m3u8-downloader`

使用

`qademd --url <m3u8的网址> --name <导出的文件名>`

`qademd` 是 `quick-and-dirty-encrypted-m3u8-downloader` 的首字母

成功时，当前目录会出现解密合并后的 <导出的文件名>.ts
