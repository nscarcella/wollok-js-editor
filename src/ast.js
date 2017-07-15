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
    nodeLabel: label(kind, text)
})

const toTree = ast => div.ast(
    ast && node('object', ast.type)(
        keys(ast).map(key => {
            if (key === 'type') return []
            if (ast[key] instanceof Array) return ast[key].length ? node('array', key)(ast[key].map(toTree)) : div(label('array', key))
            if (typeof ast[key] === 'object' && ast[key].type) return node('object', key)(toTree(ast[key]))
            return div(label('attribute', key + ' = ' + ast[key]))
        })
    )
)

export default toTree