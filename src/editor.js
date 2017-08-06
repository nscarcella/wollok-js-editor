import njsx from 'njsx'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/mode/wollok'
import 'brace/theme/textmate'
import './editor.css'

export default njsx(AceEditor)({
    theme: 'textmate',
    fontSize: 12,
    width: '350px',
    height: '500px',
    editorProps: { $blockScrolling: Infinity }
})