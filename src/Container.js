import React from 'react'
import Card from './components/card'

import { Input, Button, Modal, Switch, Icon } from 'antd'
import 'antd/dist/antd.css'

export default class Container extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            db: [
                {
                    id: 0,
                    taskName: 'Заложение основ',
                    taskAbout: 'Заложить основы для выполнения последующих задач',
                    executor: 'Работник №1',
                },
                {
                    id: 1,
                    taskName: 'Установка библиотек',
                    taskAbout: 'Установить все необходимые библиотеки для решения поставленных задач',
                    executor: 'Работник №1'
                },
                {
                    id: 2,
                    taskName: 'Создать набросок задания',
                    taskAbout: 'Создать набросок по установленному ТЗ',
                    executor: 'Работник №2'
                },
                {
                    id: 3,
                    taskName: 'Сделать приложение "Доска"',
                    taskAbout: 'Реализовать создание, удаление, редактирование и перетаскиваение элементов',
                    executor: 'Работник №3'
                },
                {
                    id: 4,
                    taskName: 'Сдать работу',
                    taskAbout: 'Работу сдать и ожидать.',
                    executor: 'Работник №3'
                }
            ],
            filteredCards: [],
            filteredString: null,

            isNewCard: false,
            addTextExecutor: '',
            addTextTaskName: '',
            addTextTaskAbout: '',
            addIsFirst: false,

            isEdit: false,
            editingID: null,
            editingExecutor: '',
            editingTaskName: '',
            editingTaskAbout: '',

            isV2Style: false
        }
    }

    componentDidMount = () => {
        this.changeFilteredCards()
    }

    changeFilteredCards = () => {
        const filteredString = this.state.filteredString
        const filteredCards = this.state.db.filter(
            ({ executor, taskName }) =>
                filteredString === null ||
                executor.toLowerCase().indexOf(filteredString.toLowerCase()) !==
                    -1 ||
                taskName.toLowerCase().indexOf(filteredString.toLowerCase()) !==
                    -1
        )
        this.setState({ filteredCards: filteredCards })
    }

    changeFilteredString = async text => {
        await this.setState({ filteredString: text.length > 0 ? text : null })
        await this.changeFilteredCards()
    }

    moveCard =async (dragIndex, hoverIndex) => {
  
        let cards = [...this.state.filteredCards]
        let dragCards = cards[dragIndex]
        cards.splice(dragIndex, 1)
        cards.splice(hoverIndex, 0, dragCards)

        await this.setState({
            filteredCards: cards,
        })
    }

    end = async () => {
        let newdb = Array.of(...new Set([...this.state.filteredCards, ...this.state.db ]))
        newdb = newdb.map((e, id) => ({...e, id}))
        console.log(newdb)
        await this.setState({db:newdb})
        await this.changeFilteredCards()
    }

    addCard = async () => {
        let cards = [...this.state.db]

        if (this.state.addIsFirst) {
            cards.unshift({
                id: 1,
                executor: this.state.addTextExecutor,
                taskName: this.state.addTextTaskName,
                taskAbout: this.state.addTextTaskAbout
            })
            cards = cards.map((e, id) => ({...e, id}))
        } else {
            cards.push({
                id: cards.length,
                executor: this.state.addTextExecutor,
                taskName: this.state.addTextTaskName,
                taskAbout: this.state.addTextTaskAbout
            })
        }
        await this.setState({
            db: cards,
            isNewCard: false,
            addTextExecutor: '',
            addTextTaskName: '',
            addTextTaskAbout: '',
            addIsFirst: false
        })
        console.log(this.state.db)
        await this.changeFilteredCards()
    }

    deleteCard = async id => {
        let cards = [...this.state.db]
        cards.splice(id, 1)
        cards = cards.map((e, id) => ({...e, id}))
        await this.setState({ db: cards })
        console.log(this.state.db)
        await this.changeFilteredCards()
    }

    openEditing = id => {
        this.setState({
            isEdit: true,
            editingID: id,
            editingExecutor: this.state.db[id].executor,
            editingTaskName: this.state.db[id].taskName,
            editingTaskAbout: this.state.db[id].taskAbout
        })
    }

    editCard = async () => {
        let db = [...this.state.db]
        db[this.state.editingID] = {
            id: this.state.editingID,
            taskName: this.state.editingTaskName,
            taskAbout: this.state.editingTaskAbout,
            executor: this.state.editingExecutor
        }

        await this.setState({
            db,
            isEdit: false,
            editingID: null,
            editingExecutor: '',
            editingTaskName: '',
            editingTaskAbout: ''
        })
        await this.changeFilteredCards()
    }

    render() {
        const renderCard = (card, index) => {
            return (
                <Card
                    key={card.id}
                    index={index}
                    id={card.id}
                    executor={card.executor}
                    taskAbout={card.taskAbout}
                    taskName={card.taskName}
                    moveCard={this.moveCard}
                    deleteCard={this.deleteCard}
                    openEditing={this.openEditing}
                    styleV2={this.state.isV2Style}
                    end={this.end}
                 
                />
            )
        }
        const cardClass = this.state.isV2Style ? 'card-list-v2' : 'card-list'
        return (
            <div>
               
                <div>
                Переключить стиль расположения заданий <Switch checked={this.state.isV2Style} onChange={() => {this.setState({isV2Style:!this.state.isV2Style})}} /> 
                    <Button
                        type="primary"
                        icon="plus-circle"
                        onClick={() => this.setState({ isNewCard: true })}
                        style={{ margin: 16 }}
                    >
                        Добавить новую задачу
                    </Button>
                    <Input
                        placeholder="поиск"
                        prefix={<Icon type="search" />}
                        allowClear
                        style={{ maxWidth: 480 }}
                        onChange={e =>
                            this.changeFilteredString(e.target.value)
                        }
                    />
                </div>
                <Modal
                    title="Добавление новой задачи"
                    visible={this.state.isNewCard}
                    onOk={this.addCard}
                    onCancel={() =>
                        this.setState({
                            isNewCard: false,
                            addTextExecutor: '',
                            addTextTaskName: '',
                            addTextTaskAbout: '',
                            addIsFirst: false
                        })
                    }
                    okButtonProps={{
                        disabled:
                            this.state.addTextExecutor.length === 0 ||
                            this.state.addTextTaskName.length === 0 ||
                            this.state.addTextTaskAbout.length === 0
                    }}
                    okText="Добавить"
                    cancelText="Отмена"
                    destroyOnClose
                >
                    <p>
                        <Input
                            placeholder="Введите название задания"
                            onChange={e =>
                                this.setState({
                                    addTextTaskName: e.target.value
                                })
                            }
                        />
                    </p>
                    <p>
                        <Input
                            placeholder="Введите описание задания"
                            onChange={e =>
                                this.setState({
                                    addTextTaskAbout: e.target.value
                                })
                            }
                        />
                    </p>
                    <p>
                        <Input
                            placeholder="Введите имя исполнителя"
                            onChange={e =>
                                this.setState({
                                    addTextExecutor: e.target.value
                                })
                            }
                        />
                    </p>
                    <span>
                        Добавить первым в списке?
                        <Switch
                            checked={this.state.addIsFirst}
                            onChange={() => {
                                this.setState({
                                    addIsFirst: !this.state.addIsFirst
                                })
                            }}
                        />
                    </span>
                </Modal>
                <Modal
                    title="Редактирование задачи"
                    visible={this.state.isEdit}
                    onOk={this.editCard}
                    onCancel={() =>
                        this.setState({
                            isEdit: false,
                            editingID: null,
                            editingExecutor: '',
                            editingTaskName: '',
                            editingTaskAbout: ''
                        })
                    }
                    okButtonProps={{
                        disabled:
                            this.state.editingExecutor.length === 0 ||
                            this.state.editingTaskName.length === 0 ||
                            this.state.editingTaskAbout.length === 0
                    }}
                    okText="Добавить"
                    cancelText="Отмена"
                    destroyOnClose
                >
                    <p>
                        <Input
                            placeholder="Введите название задания"
                            value={this.state.editingTaskName}
                            onChange={e =>
                                this.setState({
                                    editingTaskName: e.target.value
                                })
                            }
                        />
                    </p>
                    <p>
                        <Input
                            placeholder="Введите описание задания"
                            value={this.state.editingTaskAbout}
                            onChange={e =>
                                this.setState({
                                    editingTaskAbout: e.target.value
                                })
                            }
                        />
                    </p>
                    <p>
                        <Input
                            placeholder="Введите имя исполнителя"
                            value={this.state.editingExecutor}
                            onChange={e =>
                                this.setState({
                                    editingExecutor: e.target.value
                                })
                            }
                        />
                    </p>
                </Modal>
                <div className={cardClass}>
                    {this.state.filteredCards.map((card, i) =>
                        renderCard(card, i)
                    )}
                </div>
            </div>
        )
    }
}
