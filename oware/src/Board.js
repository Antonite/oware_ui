import React, { useEffect, useState } from "react";
import './Board.css';

function Board() {
    const [isLoaded, setLoaded] = useState(false);
    const [pitsUpper, setPitsUpper] = useState([]);
    const [pitsLower, setPitsLower] = useState([]);
    const [scores, setScores] = useState([]);
    const [id, setId] = useState("");

    useEffect(() => {
        setId("0/0/4,4,4,4,4,4,4,4,4,4,4,4/0,0/0,1,2,3,4,5");
    }, [])
  
    useEffect(() => {
        async function fetchData() {
            if (!id) {
                return;
            }

            let bUrl = "http://localhost:8081/board?id=" + id;
            let mUrl = "http://localhost:8081/moves?id=" + id;
            let success = true;
            const boardJson = await fetch(bUrl).then(resp => resp.json()).catch(() => {success = false;});;
            const movesJson = await fetch(mUrl).then(resp => resp.json()).catch(() => {success = false;});;
            if (!success) {
                return;
            }

            let pits = new Map();
            boardJson.Pits.forEach(function(item, index) {
                pits.set(index,{"stones": item})
            });

            movesJson.forEach(function(item, index) {
                let pit = pits.get(item.Pit);
                pit["id"] = item.Id;
                pit["reward"] = item.Reward;
                pits.set(item.Pit,pit)
            });

            let a = [];
            pits.forEach(function(v, k) {
                a.push(v);
            });

            let lower = a.slice(0,6)
            let upper = a.slice(6).reverse()
            
            setPitsUpper(upper);
            setPitsLower(lower);
            setScores(boardJson.Scores);

            setId()
            

            setLoaded(true);
        }
        fetchData();
    }, [id])

    function handleMove(id) {
        if (id) {
            setLoaded(false);
            setId(id);
        }
    }
  
    if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="board">
            <label className="score">{scores[1]}</label>
            <div className="row upper">
                {pitsUpper.map((item, i) => (
                    <div className="col" key={i} onClick={() => handleMove(item.id)}>
                        <label className="stones">{item.stones}</label>
                        {item.reward && <label className={item.reward > 0 ? "green reward" : "red reward" }>Reward: {item.reward}</label>}
                    </div>
                ))}
            </div>
            <div className="row lower">
                {pitsLower.map((item, i) => (
                    <div className="col" key={i} onClick={() => handleMove(item.id)}>
                        <label className="stones">{item.stones}</label>
                        {item.reward && <label className={item.reward > 0 ? "green reward" : "red reward" }>Reward: {item.reward}</label>}
                    </div>
                ))}
            </div>
            <label className="score">{scores[0]}</label>
        </div>
      );
    }
}

export default Board;