import React, {useState} from "react";
import Results from './Results';

function App() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const input = document.querySelector('#txtSearch').value.trim();

        if ( input.length ===0 ) {
            setQuery('');
            setRecords([]);
            setLoading(false);
        }

        else if ( input.length > 0 ) {
            setQuery(input);
            setLoading(true);

            const url = `https://api.vam.ac.uk/v2/objects/search?q=${encodeURIComponent(input)}&images_exist=1`;

            try {
                const response = await fetch(url, {'method': 'GET'});
                const jsonData = await response.json();

                setLoading(false);
                setRecords(jsonData.records);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
                setRecords([]);
            }
        }
    };

    return (
        <div>
            <h1>Search the Victoria &amp; Albert Museum</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="txtSearch">Search term:</label>
                <input id="txtSearch" type="text" />
                <button type="submit">Search</button>
            </form>

            <Results query={query} loading={loading} records={records} />
        </div>
    );
}


export default App;