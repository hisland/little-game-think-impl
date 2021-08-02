const path = require('path')
const fs = require('fs')

function genDirListHtml(list) {
  return `
  <style>
  a{line-height: 1.8em;}
  a:hover{color:darkcyan}
  </style>
  <ul>
  ${list.map((vv) => `<li><a href="${vv}">${vv}</a></li>`).join('')}
  </ul>`
}

export default function dirListPlugin() {
  return {
    name: 'vite2-plugin-dir-list',
    configureServer({ middlewares }) {
      middlewares.use((req, res, next) => {
        const { url } = req
        const url_decoded = decodeURI(url)
        const try_pwd = path.join(__dirname, url_decoded)
        if (fs.existsSync(try_pwd) && fs.statSync(try_pwd).isDirectory()) {
          if (!url_decoded.endsWith('/')) {
            res.writeHead(301, { Location: path.join(url_decoded, '/') })
            res.end()
            return
          }
          const list1 = fs.readdirSync(try_pwd, {
            withFileTypes: true,
          })
          const hasIndex = list1.some((vv) => vv.name === 'index.html')
          if (hasIndex) {
            res.writeHead(301, {
              Location: path.join(url_decoded, 'index.html'),
            })
            res.end()
          } else {
            const list2 = list1.map((file) => {
              if (file.isDirectory()) {
                return file.name + '/'
              } else {
                return file.name
              }
            })
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            res.end(genDirListHtml(list2))
          }
        } else {
          next()
        }
      })
    },
  }
}
