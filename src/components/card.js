import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Popconfirm, message, Icon } from 'antd'

const Card = ({
    id,
    executor,
    taskAbout,
    taskName,
    index,
    moveCard,
    deleteCard,
    openEditing,
    styleV2,
    end
}) => {
    
    const ref = useRef(null)
    const [, drop] = useDrop({
        accept: 'card',
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            if (dragIndex === hoverIndex) {
                return
            }
            
            moveCard(dragIndex, hoverIndex)
            item.index = hoverIndex
        }

        
    })
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'card', id, index },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        end: () =>{
            end()
        } 
    })
    const cardClassName = isDragging ? 'card dragging-card' : styleV2 ? 'card-v2' : 'card'
    drag(drop(ref))
    return (
        <div ref={ref} className={cardClassName}>
            <div className="task-name">{taskName}</div>
            <div className="task-info">{taskAbout}</div>
            <div className="task-executor">
                <Icon type="user" style={{ marginRight: 4 }} />
                {executor}
            </div>

            <Popconfirm
                title="Вы уверены что хотите удалить эту задачу?"
                onConfirm={() => {
                    deleteCard(id)
                    message.success('Удалено')
                }}
                okText="Yes"
                cancelText="No"
            >
                <Icon
                    className="action-button action-button-remove"
                    type="delete"
                />
            </Popconfirm>
            <Icon
                className="action-button action-button-edit"
                type="edit"
                onClick={() => openEditing(id)}
            />
        </div>
    )
}
export default Card
