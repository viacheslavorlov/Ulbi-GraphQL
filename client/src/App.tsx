import React, {FC, useEffect, useState} from 'react';
import './App.css';
import {useMutation, useQuery} from "@apollo/client";
import {GET_ALL_USERS, GET_ONE_USER} from "./query/user";
import {CREATE_USER} from "./mutation/user";

interface IUser {
    id: string
    username: string
    age: number
    posts: IPost[]
}

interface IPost {
    id: string
    title: string
    content: string
}


const App: FC = () => {
    const [userName, setUserName] = useState('');
    const [singleUser, setSingleUser] = useState<IUser | null>(null)
    const [users, setUsers] = useState<IUser[]>([]);
    const [username, setUsername] = useState('');
    const [age, setAge] = useState(0);
    const {data, loading, error, refetch} = useQuery(GET_ALL_USERS);
    const [newUser] = useMutation(CREATE_USER);
    const {data: oneUser, loading: oneUserLoading, error: oneUserError} = useQuery(GET_ONE_USER, {
        variables: {
            username: userName
            }
    });
    console.log(oneUser)


    const content = !loading ?
        users.map((user, i) =>
            <div key={i} className="user">
                {user.id}. {user.username} {user.age}
            </div>)
        : error ? <h1>ERROR</h1> : <h1>Loading...</h1>

    useEffect(() => {
        if (!loading) {
            setUsers(data.getAllUsers.map((user: { username: string; age: number; id: string; }) => {
                return {
                    username: user.username,
                    age: user.age,
                    id: user.id
                }
            }))
            console.log(users)
        }
    }, [data]);

    const addUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        newUser({
            variables: {
                input: {
                    username, age
                }
            }
        }).then(({data}) => {
            console.log(data)
            setAge(0)
            setUsername('')
        }).then(() => refetch());
    }

    const getAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        refetch();
    }

    const getSingleUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setSingleUser(oneUser.getUser)
    }

    return (
        <div className="App">
            <form>
                <input value={username} onChange={e => setUsername(e.target.value)} type="text"/>
                <input value={age} onChange={e => setAge(parseInt(e.target.value))} type="number"/>
                <input value={userName} onChange={e => setUserName(e.target.value)} type="text"/>
                <div className="btns">
                    <button onClick={e => addUser(e)}>создать</button>
                    <button onClick={e => getAll(e)}>получить</button>
                    <button onClick={e => getSingleUser(e)}>получить одного</button>
                </div>
            </form>
            <div>
                {users.length > 0 && content}
            </div>
            <div>
                {!oneUserError && oneUserLoading ? <h2>Loading...</h2> : <h2>{singleUser?.age} </h2>}
            </div>
        </div>
    );
}

export default App;
