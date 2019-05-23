import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Repos, {ListItemRepoProps} from "./Repo";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import SearchBar from "./SearchBar";
import {Repositories} from "./travis_api";

library.add(fas, fab);

interface AppProps {
}

interface AppState {
  repos?: Repositories | null
}

const testRepos: ListItemRepoProps[] = [
  {owner: 'AllanWang', repo: 'KAU'},
  {owner: 'AllanWang', repo: 'Test'},
  {owner: 'AllanWang', repo: 'Hello'}];

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.setRepos = this.setRepos.bind(this)
  }

  state: AppState = {};

  setRepos(repos: Repositories | null) {
    this.setState({
      repos: repos
    })
  }

  render() {
    const {repos} = this.state;
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
          <SearchBar setRepos={this.setRepos}/>
          <Repos repos={repos ? repos.repositories.map(r => ({owner: r.owner.login, repo: r.name})) : null}/>
          {/*<MaterialIcon icon='add' hasRipple={true}>Click Me </MaterialIcon>*/}
        </header>
      </div>
    );
  }
}

