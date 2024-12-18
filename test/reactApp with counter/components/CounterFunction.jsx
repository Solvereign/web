import React, {useState, useEffect} from "react";
function CounterFunction({count}){
    const [counter, setCounter] = useState(count);
    return (
        <div>
            <p>Та {counter} удаа дарлаа.</p>
            <button onClick={()=>setCounter(counter+1)}>Дар</button>
        </div>
    );
}
export default CounterFunction;