#!env node
import crypto from 'crypto'
import got from 'got'
import fs from 'fs'
import path from 'path'
import { cwd } from 'process'
import Bar from 'progress'

import { Command } from 'commander'
const program = new Command()
program.showHelpAfterError()

import { Parser } from 'm3u8-parser'
const parser = new Parser()

program
    .requiredOption('-u, --url <m3u8 网址>', 'm3u8 网址')
    .requiredOption('-n, --name <标题>', '标题')
    .requiredOption('-o, --output <输出路径>', '输出路径，默认为当前路径', cwd())
program.parse()

const {
    url: m3u8,
    name: title,
    output
} = program.opts()

const { body: m3u8Text } = await got.get(m3u8, {
    responseType: 'text'
});
parser.push(m3u8Text)
parser.end()

const ivStartFlag = 'IV=0x'
const ivStartPos = m3u8Text.indexOf(ivStartFlag)
const iv = m3u8Text.substr(ivStartPos + ivStartFlag.length, 16)

const { body: key } = await got.get(parser.manifest.segments[0].key.uri, {
    responseType: 'buffer'
})
const uriBase = path.parse(m3u8).dir
const tsFiles = []
const bar = new Bar('下载进度 [:bar] :current/:total :file', {
    total: parser.manifest.segments.length
});

for(let idx in parser.manifest.segments) {
    const segment = parser.manifest.segments[idx]
    const url = `${uriBase}/${segment.uri}`
    const { body: video } = await got.get(url, {
        responseType: 'buffer'
    })
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    
    tsFiles.push(Buffer.concat([
        decipher.update(video),
        decipher.final()
    ]))
    bar.tick({
        file: segment.uri
    })
}
fs.writeFileSync(output + '/' + title + '.ts', Buffer.concat(tsFiles))
