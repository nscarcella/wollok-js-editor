import njsx from 'njsx'
import { span, img, div } from 'njsx/react'
import TreeView from 'react-treeview'
import './ast.css'
import 'react-treeview/react-treeview.css'

const tree = njsx(TreeView)
const { keys } = Object

let nodeKey = 0

const label = (kind, text) => span(img.node[kind](), span(text))()
const attribute = text => div(label('attribute', text))

const node = (text, kind) => tree({
    key: nodeKey++,
    defaultCollapsed: false,
    nodeLabel: label(kind, text),
    itemClassName: kind,
    treeViewClassName: kind,

})
const isComplexNode = (key, value) => typeof value === 'object' && value.type

const toTree = (ast, features) => div.ast(
    ast && node(ast.type, 'object')(
        keys(ast)
        .filter(key => shouldShow(features, key, ast[key]))
        .map(key => {
          if (key === 'type') return []
          if (key === 'scope') return scopeNode(ast[key])
          if (key === 'path') return pathNode(ast[key])
          if (ast[key] instanceof Array) return ast[key].length ? node(key, `array ${key}`)(ast[key].map(_ => toTree(_, features))) : div(label('array', key))
          if (isComplexNode(key, ast[key])) return node(key, 'object')(toTree(ast[key], features))
          if (typeof ast[key] === 'function') return attribute(functionToLabel(ast[key]))
          return attribute(`${key} = ${toValue(ast[key])}`)
        })
    )
)

const scopeNode = scope => node('scope', 'object scope')(Object.keys(scope).map(k => attribute(`${k} = <span class="path">${scope[k].join('.')}</span>`)))
const pathNode = path => attribute(`path = ${path.join('.')}`)

// this needs a refacto :P
const shouldShow = (features, key, value) => {
  if (typeof value === 'function' && features) { return features.method }
  if (key === 'parent' && features) { return features.parent }
  if (key === 'scope' && features) { return features.scope }
  if (key === 'path' && features) { return features.path }
  return true
}

const FN_EXTRACTOR_REGEXP = /function ([^(]*)[ ]*\((.*)\).*/
const functionToLabel = fn => {
  const [, name, args] = fn.toString().split(FN_EXTRACTOR_REGEXP)
  return `${name}(${args})`
} 
const toValue = v => (typeof v === 'function') ? `${v.name}()` : v

export default toTree