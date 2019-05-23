import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Repos, {ReposProps} from "./Repo";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import SearchBar from "./SearchBar";

library.add(fas, fab);

const testRepos: ReposProps = {
  repos: [{owner: 'AllanWang', repo: 'KAU'}, {owner: 'AllanWang', repo: 'Test'}, {owner: 'AllanWang', repo: 'Hello'}]
};

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <SearchBar/>
        <Repos {...testRepos}/>
        {/*<MaterialIcon icon='add' hasRipple={true}>Click Me </MaterialIcon>*/}
      </header>
    </div>
  );
};

export default App;
