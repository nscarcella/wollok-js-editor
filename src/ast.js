import njsx from 'njsx'
import { span, img, div } from 'njsx/react'
import TreeView from 'react-treeview'
import './ast.css'
import 'react-treeview/react-treeview.css'

const tree = njsx(TreeView)
const { keys } = Object

let nodeKey = 0

const label = (kind, text) => span(img.node[kind](), span(text))()

const node = (kind, text) => tree({
    key: nodeKey++,
    defaultCollapsed: false,
    nodeLabel: label(kind, text),
    itemClassName: kind
})

const toTree = (ast, features) => div.ast(
    ast && node('object', ast.type)(
        keys(ast)
        .filter(key => shouldShow(features, key, ast[key]))
        .map(key => {
            if (key === 'type') return []
            if (ast[key] instanceof Array) return ast[key].length ? node('array', key)(ast[key].map(_ => toTree(_, features))) : div(label('array', key))
            if (typeof ast[key] === 'object' && ast[key].type) return node('object', key)(toTree(ast[key], features))
            if (typeof ast[key] === 'function') return div(label('attribute', functionToLabel(ast[key])))
            return div(label('attribute', `${key} = ${toValue(ast[key])}`))
        })
    )
)

const shouldShow = (features, key, value) => {
  if (typeof value === 'function' && features) { return features.method }
  if (key === 'parent' && features) { return features.parent }
  if (key === 'scope' && features) { return features.scope }
  return true
}

const FN_EXTRACTOR_REGEXP = /function ([^(]*)[ ]*\((.*)\).*/
const functionToLabel = fn => {
  const [, name, args] = fn.toString().split(FN_EXTRACTOR_REGEXP)
  return `${name}(${args})`
} 
const toValue = v => (typeof v === 'function') ? `${v.name}()` : v

export default toTree