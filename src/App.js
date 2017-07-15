import { Component } from 'react'
import { js_beautify } from 'js-beautify'
import { div, h2 } from 'njsx/react'
import compile from 'wollok-js/compiler'
import parser from 'wollok-js/parser'
import editor from './editor'
import ast from './ast'
import './App.css'

var linker = require('wollok-js/linker/linker')

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.code !== nextState.code
  }

  render() {
    let model = undefined
    let jsCode = ''

    try {
      // model = link(parser.parse(this.state.code))
      const parsedModel = parser.parse(this.state.code)
      const linkedModel = linker.link(parsedModel)
      model = linkedModel
      jsCode = compile(model)
    } catch (error) {
      jsCode = error.message
      model = undefined
    }

    return div.app(
      div.section(
        h2('Wollok:'),
        editor({
          mode: "wollok",
          onChange: (code, event) => this.setState({ code }),
          value: this.state.code,
          style: { borderStyle: 'ridge' }
        })
      ),

      div.section(
        h2('Compiled Javascript:'),
        editor({
          mode: "javascript",
          highlightActiveLine: false,
          readOnly: true,
          value: js_beautify(jsCode),
          style: { borderStyle: 'ridge', backgroundColor: model ? 'white' : 'indianred' }
        })
      ),

      div.section(
        h2('AST:'),
        // ast(model)
      )
    )()
  }
}