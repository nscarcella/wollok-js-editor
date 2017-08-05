import { Component } from 'react'
import { js_beautify } from 'js-beautify'
import { div, h2, button, text, check } from 'njsx/react'
import { compiler, parser, linker } from 'wollok-js'
import { wre } from 'wollok-js/wre/lang.natives'
import editor from './editor'
import ast from './ast'
import './App.css'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      filter: {}
    }
  }

  render() {
    let model = undefined
    let jsCode = ''
    let result = ''

    try {
      model = linker(parser(this.state.code))
      jsCode = compiler(model)
    } catch (error) {
      jsCode = error.message
      model = undefined
    }

    return div.app(
      div.center(
        div.section(
          h2('Wollok'),
          editor({
            mode: "wollok",
            onChange: (code, event) => this.setState({ ...this.state, code }),
            value: this.state.code
          }),
        ),

        div.section(
          h2('Compiled Javascript'),
          editor({
            mode: "javascript",
            highlightActiveLine: false,
            readOnly: true,
            value: js_beautify(jsCode),
            style: { backgroundColor: model ? '#e6e6e6' : 'indianred' }
          })
        ),

        div.section(
          div.header(
            h2('AST'),
            div.controls(
              control('Methods', () => this.toggleView('method'), this.state.filter.method),
              control('Parent', () => this.toggleView('parent'), this.state.filter.parent),
              control('Scope', () => this.toggleView('scope'), this.state.filter.scope)
            )
          ),
          div.astPane(ast(model, this.state.filter))
        ),
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

  toggleView(type) {
    this.setState({ 
      ...this.state,
      filter: {
        ...this.state.filter,
        [type]: !this.state.filter[type]
      }
    })
  }
}

const control = (label, onClick, enabled) => div.controlsItem(
  text(label, { onClick, className: enabled ? 'on' : 'off' })
)
