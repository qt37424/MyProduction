# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

1. authen sẽ được xử lí thông qua API, ở đây mình sẽ xây dựng kiến trúc theo hướng, client sẽ giữ token hoặc cái gì đó bao gồm time đăng nhập và id cho lần đăng nhập đó.
Từ đó mỗi lần request thực hiện từ phía client sẽ gửi 2 thông tin này cho server API giải quyết.