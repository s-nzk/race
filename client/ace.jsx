import React from 'react';

import io from 'socket.io-client';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/monokai';

import 'brace/ext/language_tools'

import styles from 'bulma';


import 'brace/mode/javascript';
import 'brace/mode/jsx';
import 'brace/mode/json';
import 'brace/mode/css';



import 'brace/mode/java';
import 'brace/mode/scala';
import 'brace/mode/php';

import 'brace/mode/properties';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/perl';
import 'brace/mode/golang';
import 'brace/mode/swift';
import 'brace/mode/c_cpp';
import 'brace/mode/jsp';
import 'brace/mode/sql';
import 'brace/mode/html';
import 'brace/mode/xml';


const modeList = {
    javascript: 'javascript',
    jsx: 'jsx',
    json: 'json',
    css: 'css',
    java: 'java',
    scala: 'scala',
    php: 'php',
    properties: 'properties',
    python: 'python',
    ruby: 'ruby',
    perl: 'perl',
    golang: 'golang',
    swift: 'swift',
    c_cpp: 'c++',
    jsp: 'jsp',
    sql: 'sql',
    html: 'html',
    xml: 'xml'
};

//Base64
const Base64 = {
    encode: (str) =>  {
        return btoa(unescape(encodeURIComponent(str)));
    },
    decode: (str) =>  {
        return decodeURIComponent(escape(atob(str)));
    }
};

export default class Ace extends React.Component {
    constructor(props) {
        super(props);

        
        this.state = {
            mode: 'javascript',
            value: 'var x = 100;'
        };

        //hashからテキストを復元
        let hash = location.hash;
        if(hash.length >= 2){
            try{
                let saveData = JSON.parse(Base64.decode(hash.slice(1)));
                console.log(saveData);
                this.state = {
                    mode: saveData.mode,
                    value: saveData.value
                };
            }catch(error){
                console.error(error);
                //ignore
            }            
           

        }


        //socket.io接続(location.pathnameがroomID)
        this.socket = io('/', {query: `path=${location.pathname}`});

        //editor changeのブロードキャスト受信
        this.socket.on('editor onchange', (newValue) => {
            this.setState({value: newValue});
        });
    }

    //エディター初期設定
    componentDidMount(){
        this.editor = ace.edit('editor');
        this.editor.commands.addCommand({
            name: 'save',
            bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
            exec: () => {
                this.saveData();
            }
        });
    }

    //モードプルダウン変更
    modeChange(event) {
        this.setState({mode: modeList[event.target.value]});
    }

    //エディター書き込み時
    onChange(newValue) {
        this.socket.emit('editor onchange' ,newValue);
        this.setState({value: newValue});

        // console.log('change', newValue);
    }

    //保存ボタン
    saveData(){
        let saveData = {
            mode: this.state.mode,
            value: this.state.value
        };
        console.log(saveData);
        let base64 = Base64.encode(JSON.stringify(saveData));
        location.hash = base64; 
    }

    //言語プルダウン生成
    renderLanguage(){
        return Object.keys(modeList).map((key) => <option key={key} value={key} >{modeList[key]}</option>)
    }

    render() {
        return ( 
            <div className="columns" style={{margin: '1%'}}>
                <div className="column">
                    <AceEditor mode = { this.state.mode }
                    theme = "monokai"
                    onChange = { this.onChange.bind(this) }
                    name = "editor"
                    value = { this.state.value }
                    height = "95vh"
                    width = "100%"
                    enableBasicAutocompletion={true}
                    enableLiveAutocompletion={true}
                    editorProps = {
                        { $blockScrolling: Infinity }
                    }
                />
                </div>
                <div className="column is-one-quarter">
                    <label className="label">Language</label>
                    <p className="control">
                        <span className="select">
                            <select value={this.state.mode} onChange = { this.modeChange.bind(this) }>
                                {this.renderLanguage()}
                            </select>
                        </span>
                    </p>
                    <p className="control">
                        <a className="button is-outlined" onClick={ this.saveData.bind(this) } >Save</a>
                    </p>
                </div>
            </div>
        );
    };
};