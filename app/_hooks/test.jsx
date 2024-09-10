import { useState } from "react";
import { useOptimistic, useTransition } from "react";


async function getTodos() {
    const response = await fetch("http://localhost:8080/api/todos");
    return await response.json();
}

async function addTodo(text) {
    const response = await fetch("http://localhost:8080/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("Failed to add todo");
    return await response.json();
}

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [isPending, startTransition] = useTransition();
    const [optimisticTodos, simplifiedAddTodo] = useOptimistic(
        todos,
        (state, text) => {
            return [...state, { id: Math.random().toString(36).slice(2), text }];
        }
    );


    async function addNewTodo() {
        simplifiedAddTodo(newTodo);
        try {
            await addTodo(newTodo);
            setTodos(await getTodos());
        } catch (error) {
            console.error(error);
        } finally {
            setNewTodo("");
        }
    }


    return (
        <>
        
            <ul>
                {optimisticTodos.map((todo) => (
                    <li key={todo.id}>{todo.text}</li>
                ))}
            </ul>

            <input
                disabled={isPending}
                type="text"
                name="text"
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
                onKeyUp={(event) => {
                    if (event.key === "Enter") {
                        startTransition(() => addNewTodo());
                    }
                }}
            />

        </>
    );
}

export default App;