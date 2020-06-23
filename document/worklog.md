# 作業履歴

# 開発環境構築

npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev ts-loader typescript
npm install --save-dev react
npm install --save-dev jest
npm install --save-dev core-js@3
npm install --save-dev webpack-merge html-webpack-plugin html-loader css-loader sass-loader
npm install --save-dev @babel/core @babel/preset-env @babel/register

./node_modules/.bin/tsc --init
npm i @types/{react,react-dom} --save-dev

npm install --save-dev react-dom source-map-loader

npm install typescript@latest react@latest react-dom@latest @types/react@latest @types/react-dom@latest webpack@latest webpack-dev-server@latest webpack-cli@latest ts-loader@latest clean-webpack-plugin@latest html-webpack-plugin@latest --save-exact

## 一旦上のを全部捨てて、入れ直し

npm i -D webpack webpack-cli typescript ts-loader
npm i -S react react-dom @types/react @types/react-dom

npm i -D webpack-dev-server
npm i -D webpack-merge

npm i -D @babel/core @babel/preset-env @babel/register
npm i -D html-loader css-loader sass-loader
npm i -D html-webpack-plugin
npm i -D source-map-loader
npm i -D node-sass
npm i -D style-loader

