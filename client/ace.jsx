import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/theme/monokai';

import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/ruby';
import 'brace/mode/perl';


import 'brace/ext/language_tools'


import styles from 'bulma';


import io from 'socket.io-client';


const modeList = [
    {label: 'javascript', value: 'javascript'},
    {label: 'java', value: 'java'},
    {label: 'ruby', value: 'ruby'},
    {label: 'perl', value: 'perl'},
    {label: 'golang', value: 'golang'},
    {label: 'swift', value: 'swift'},
    {label: 'c++', value: 'c_cpp'},
    {label: 'jsp', value: 'jsp'},
];

export default class Ace extends React.Component {
    constructor(props) {
        super(props);

        this.socket = io('/', {query: `path=${location.pathname}`});
        this.state = {
            mode: 'javascript',
            value:'var x = 10000;'
        };
        this.socket.on('editor onchange', (newData) => {
            this.setState({value: newData});
        });
    }

    handleOnchange(event) {
        this.setState({mode: modeList[event.target.value]});
    }

    onChange(newValue) {
        this.socket.emit('editor onchange' ,newValue);
        // console.log('change', newValue);
    }

    renderLanguage(){
        return modeList.map((v,i) => <option key={i}>{v.label}</option>)
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
                        { $blockScrolling: true }
                    }
                />
                </div>
                <div className="column is-one-quarter">
                    <label className="label">Language</label>
                    <p className="control">
                        <span className="select">
                            <select value={ this.mode } onChange = { this.handleOnchange.bind(this) }>
                                {this.renderLanguage()}
                            </select>
                        </span>
                    </p>
                </div>
            </div>
        );
    };
};