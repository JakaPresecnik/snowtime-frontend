import { useState } from "react";
import { Link } from "react-router-dom";
import ReactLoading from 'react-loading';

function AddSlope (props) {
    const [data, setData] = useState(null)
    const [name, setName] = useState(null)
    const [id, setId] = useState(null)
    const [loading, setLoading] = useState(false);
    const [difficulty, setDifficulty] = useState(null)

    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleIdChange = (e) => {
        setId(e.target.value);
    }
    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch(`http://127.0.0.1:5000/${props.resort}/slopes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                     'name': name,
                     'id': id,
                     'difficulty': difficulty
                })
            });
            const resData = await res.json()
            setData(resData)
            setLoading(false)
        }catch(e) {
            console.log(e);
        }
    }

    if(data) {
        if(data.success) {
            return (
                <section>
                    <div className='subheader'>
                        <h2>Nova proga dodana!</h2>
                    </div>
                    <div className='box'>
                        <p className="hrline">{data.new_slope.id}. {data.new_slope.name} s težavnostjo: {data.new_slope.difficulty} - je uspešno dodana v bazo podatkov.</p>
                    </div>
                    <Link to='/operating/slopes'><button className='back'>Nazaj na proge</button></Link>
                </section>
            )
        }else {
            return(
                <section className='form-new'>
                    <div className='subheader'>
                        <h2>{data.error}</h2>
                    </div>
                    <div className='box'>
                        <p className="hrline">{data.message}</p>
                    </div>
                    <Link to='/operating/slopes'><button className='back'>Nazaj na proge</button></Link>
                </section>
            )
        }
    }

    return (
        <div>
            <div className='subheader'>
                <h2>Dodaj progo</h2>
            </div>
            {loading ? (
                <div>
                    <div className='loading'>
                        <ReactLoading type={'spokes'} color={'#4e515a'} height={225} width={225} />
                    </div>
                    <p className="loading-text" >Nalaganje ...</p>
                </div>
                ) : (
                <form className="box addLiftBox">
                    <div>
                        <label htmlFor="name">Ime proge:</label>
                        <input 
                            type="text" 
                            name="name"
                            onChange={e => handleNameChange(e)}
                            placeholder='Ime proge'></input>
                    </div>
                    <div>
                        <label htmlFor="id">ID:</label>
                        <input 
                            type="number" 
                            name="id"
                            onChange={e => handleIdChange(e)}
                            placeholder='Id proge'></input>
                    </div>
                    <div>
                        <label htmlFor="difficulty">Težavnost proge: </label>
                        <select name="difficulty" onChange={e => handleDifficultyChange(e)}>
                            <option disabled selected>Težavnost proge</option>
                            <option value={1}>Lahka</option>
                            <option value={2}>Srednje težavna</option>
                            <option value={3}>Težavna</option>
                        </select>
                    </div>
                    <button disabled={!name || !id || !difficulty} className='saveChanges' onClick={e => handleUpdate(e)}>Dodaj progo</button>
                    <Link to='/operating/slopes'><button className='back'>Nazaj na proge</button></Link>
                </form>
            )}
        </div>
    )
}

export default AddSlope;