import _ from 'lodash';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 } from 'uuid';
import './App.css';

const item1={
  id:v4(),
  name:"clean the house"
}
const item2={
  id:v4(),
  name:"wash the car"
}
const item3={
  id:v4(),
  name:"Go to market"
}

function App() {
  const [text,setText] = useState('')
  const [state,setState] = useState({
    "todo":{
      title:"Todo",
      items: [item1,item2]
    },
    "in-progress":{
      title:"In Progress",
      items: []
    },
    "done":{
      title:"Completed",
      items: [item3]
    }
  })

  const handleDragEnd = ({destination,source})=>{
    if(!destination){
      return
    }

    if(destination.index === source.index && destination.droppableId ===source.droppableId){
      return
    }

    const itemCopy = {...state[source.droppableId].items[source.index]}
    console.log(itemCopy);
    setState(prev=>{
      prev = {...prev}
      prev[source.droppableId].items.splice(source.index,1)
      prev[destination.droppableId].items.splice(destination.index,0,itemCopy)

      return prev
    })
  }

  const addItem =()=>{
    setState(prev=>{
      return{
        ...prev,
        todo:{
          title:"Todo",
          items:[{
            id:v4(),
            name:text
          },...prev.todo.items]
        }
      }
    })

    setText("")
  }

  return (
    <div className="App ">
      <div className="text-center  m-4  w-50">
        <input className="form-control" type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="What do you want to do?" aria-label="default input example"></input>
        <button type="button" className="btn btn-success mt-2" onClick={addItem}>ADD</button>
      </div>

      <div className="dragDiv">
        <DragDropContext onDragEnd={handleDragEnd}>
          {
            _.map(state,(data,key)=>{
              return (
                <div key={key} className="column">
                  <h3>{data.title}</h3>
                  <Droppable droppableId={key}>
                    {(provided)=>{
                      return (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="droppable-col">
                          {
                            data.items.map((el,index)=>{
                              return(
                                <Draggable key={el.id} index={index} draggableId={el.id}>
                                  {
                                    (provided,snapshot)=>{
                                      return(
                                        <div className={`item ${snapshot.isDragging && "dragging"}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                          {el.name}
                                        </div>
                                      )
                                    }
                                  }
                                </Draggable>
                              )
                            })
                          }
                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </div>
              )
            })
          }
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
