import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Repos from "./Repo";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import SearchBar from "./SearchBar";
import {Build, Repositories, Slug} from "./travis_api";

library.add(fas, fab);

interface AppProps {
}

interface AppState {
  repos?: Repositories | null
  subscriptions: Set<Slug>
  builds: Record<Slug, Build>
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.setRepos = this.setRepos.bind(this);
    this.addRepoSubscription = this.addRepoSubscription.bind(this);
    this.removeRepoSubscription = this.removeRepoSubscription.bind(this);
  }

  state: AppState = {
    subscriptions: new Set<Slug>(),
    builds: {}
  };

  private setRepos(repos: Repositories | null) {
    this.setState({
      repos: repos
    })
  }

  private addRepoSubscription(slug: Slug) {
    let subscriptions = this.state.subscriptions;
    if (subscriptions.has(slug)) {
      return
    }
    subscriptions = new Set(subscriptions);
    subscriptions.add(slug);
    this.setState({subscriptions});
  }

  private removeRepoSubscription(slug: Slug) {
    let subscriptions = this.state.subscriptions;
    if (!subscriptions.has(slug)) {
      return
    }
    subscriptions = new Set(subscriptions);
    subscriptions.delete(slug);
    this.setState({subscriptions});
  }

  render() {
    const {repos, subscriptions} = this.state;
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
          <Repos repos={repos} subscriptions={subscriptions} addRepoSubscription={this.addRepoSubscription}
                 removeRepoSubscription={this.removeRepoSubscription}/>
        </header>
      </div>
    );
  }
}

