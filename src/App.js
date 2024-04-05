import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";

function App() {
    const [userData, setUserData] = useState({});
    const [repositories, setRepositories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('bassamyakoub41'); 
    const [buttonClicked, setButtonClicked] = useState(false); 

    useEffect(() => {
        if (buttonClicked) {
            // Call the function to fetch user data and repositories
            fetchData();
            setSearchTerm('');
        }
    }, [buttonClicked,]);

    const fetchData = () => {
        axios.get(`http://api.github.com/users/${searchTerm}?client_id=3a2b4fa333b9163649fa&client_secret=add7ef90520823ba63304f643411fb1a35007ac9&sort=created`)
            .then((res) => {
                setUserData(res.data);
                // Make the repositories request after getting user information
                return axios.get(`https://api.github.com/users/${searchTerm}/repos`);
            })
            .then((res) => {
                setRepositories(res.data);
            })
            .catch((err) => console.log("Error: " + err))
            .finally(() => {
                setButtonClicked(false); // Reset buttonClicked state after fetching data
            });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setButtonClicked(true);
    }

    const MappingRepos = repositories.map((item) => {
        return (
            <tr key={item.id}>
                <td>
                    <a href={`https://github.com/${searchTerm}/${item.name}`} target="_blank" rel='noreferrer'>
                        {item.name}
                    </a>
                </td>
                <td>{item.description}</td>
            </tr>
        )
    });

    return (
      <div>
          <div className='formInput'>
              <form onSubmit={handleSearch}>
                  <input className='form-control'
                      type="text"
                      placeholder="Enter GitHub username"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className='btn btn-secondary' type="submit">Search</button>
              </form>
          </div>
          {Object.keys(userData).length > 0 && (
              <div>
                  <div className='UserInfo'>
                      <div className='img'>
                          <img src={userData.avatar_url} alt="Profile Image"/>
                      </div>
                      <div className='info'>
                          <div className="user-info-item">
                              <h1>Full Name:</h1> 
                              <h4>{userData.name}</h4>
                          </div>
                          <div className="user-info-item">
                              <h1>User Name:</h1>
                              <h4>{userData.login}</h4>
                          </div>
                          <div className="user-info-item">
                              <h1>Location:</h1> 
                              <h4>{userData.location}</h4>
                          </div>
                          <div className="user-info-item">
                              <h1>Followers:</h1> 
                              <h4>{userData.followers}</h4>
                          </div>
                      </div>
                  </div>
                  <div className='Repository'>
                      <h1>Repository:</h1>
                      <table className='table table-hover'>
                          <thead>
                              <tr>
                                  <th>Name</th>
                                  <th>Description</th>
                              </tr>
                          </thead>
                          <tbody>
                              {MappingRepos}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}
      </div>
  );
}

export default App;


