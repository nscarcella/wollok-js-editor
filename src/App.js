import { Component } from 'react'
import { js_beautify } from 'js-beautify'
import { div, h2, button, text } from 'njsx/react'
import { compiler, parser, linker } from 'wollok-js'
import { wre } from 'wollok-js/wre/lang.natives'
import editor from './editor'
import ast from './ast'
import './App.css'

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
    let result = ''

    try {
      model = linker(parser(this.state.code))
      jsCode = compiler(model)
      console.log('compiled:' + jsCode)
    } catch (error) {
      jsCode = error.message
      // jsCode = JSON.stringify(error, null, 2)
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
      ),

      div.footer(
        button('eval', {
          onClick() {
            try {
              function doEval(wre) {
                return eval(jsCode)
              }
              result = doEval(wre)
            }
            catch (error) {
              result = 'Error: ' + error
            }
          }
        }),
        text[result.startsWith('Error') ? 'error' : 'ok'](result)
      )
    )()
  }
}