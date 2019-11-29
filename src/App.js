import React from 'react'
import './App.css'
import Container from './Container'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './index.css'

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <DndProvider backend={HTML5Backend}>
                    <Container />
                </DndProvider>
            </div>
        )
    }
}
