import React, { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import WelcomeHeader from '@/components/common/WelcomeHeader';
import { IconTrash } from '@tabler/icons-react';

export default function Todo() {

    const breadcrumbItem = [
        {
            name: "App",
        },
        {
            name: "Todo List",
        },
    ]

    const [todoList, setTodoList] = useState([
        "Weekly Bigbazar Shopping",
        "Pay the electricity bills",
        "Contrary to popular belief, Lorem Ipsum is not simply random text",
        "Make dinner reservation",
        "All the Lorem Ipsum generators on the Internet",
        "Many desktop publishing packages and web page editors"
    ]);
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState('');

    const handleAddTodo = () => {
        if (newTodo.trim() === '') {
            setError("Input can't be empty!");
            return;
        }
        setTodoList([...todoList, newTodo]);
        setNewTodo('');
        setError('');
    };

    const handleDeleteAll = () => {
        setTodoList([]);
    };

    const handleDeleteTodo = (index) => {
        const newList = [...todoList];
        newList.splice(index, 1);
        setTodoList(newList);
    };

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='card border border-dashed border-border-color bg-card-color rounded-xl overflow-hidden'>
                    <div className='md:p-6 p-4'>
                        My Todo list
                    </div>
                    <div className='bg-body-color md:p-6 p-4'>
                        <div className='floating-form-control'>
                            <input
                                type='text'
                                id='TodoInput1'
                                className='form-input'
                                placeholder="What you need to do, sir?"
                                value={newTodo}
                                onChange={(e) => {
                                    setNewTodo(e.target.value);
                                    setError('');
                                }}
                            />
                            <label htmlFor='TodoInput1' className='form-label'>What you need to do, sir?</label>
                        </div>
                        {error && <div className="text-danger text-[14px]/[20px]">{error}</div>}
                        <div className='flex items-center gap-2 mt-2'>
                            <button className='btn btn-success' onClick={handleAddTodo}>
                                Add
                            </button>
                            <button className='btn btn-danger' onClick={handleDeleteAll}>
                                Delete All
                            </button>
                        </div>
                    </div>
                    <ul className='md:px-6 px-4'>
                        {todoList.map((todo, index) => (
                            <li key={index} className='py-4 flex items-center justify-between gap-2 border-b border-border-color last:border-none'>
                                <div className="form-check todo">
                                    <input type="checkbox" id={'todoItem' + index} className="form-check-input check-line" />
                                    <label htmlFor={'todoItem' + index} className="form-check-label !text-[16px]/[24px]">{todo}</label>
                                </div>
                                <button className='bg-danger rounded-full text-white p-5' onClick={() => handleDeleteTodo(index)}>
                                    <IconTrash className='w-[16px] h-[16px]' />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
