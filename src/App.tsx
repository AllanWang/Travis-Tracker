import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Repos from "./Repo";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import SearchBar from "./SearchBar";
import {BuildInfo, Repositories, Slug} from "./travis-api";
import TravisStorage from "./travis-storage";
import {MapModifier, SetModifier} from "./state-modifier";

library.add(fas, fab);

interface AppProps {
}

interface AppState {
  repos?: Repositories | null
  subscriptions: Set<Slug>
  builds: Map<Slug, BuildInfo>
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.setRepos = this.setRepos.bind(this);
  }

  state: AppState = {
    subscriptions: TravisStorage.subscriptions.get(),
    builds: TravisStorage.builds.get()
  };

  private setRepos(repos: Repositories | null) {
    this.setState({
      repos: repos
    })
  }

  private subscriptionModifier = new (class extends SetModifier<Slug, AppState> {
    get(): Set<string> {
      return this.component.state.subscriptions;
    }

    set(data: Set<string>): void {
      this.component.setState({subscriptions: data});
      TravisStorage.subscriptions.set(data);
    }
  })(this);

  private buildModifier = new (class extends MapModifier<Slug, BuildInfo, AppState> {
    get(): Map<string, BuildInfo> {
      return this.component.state.builds;
    }

    set(data: Map<string, BuildInfo>): void {
      this.component.setState({builds: data});
      TravisStorage.builds.set(data);
    }
  })(this);

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
          <Repos repos={repos} subscriptions={subscriptions} buildModifier={this.buildModifier}
                 subscriptionModifier={this.subscriptionModifier}/>
        </header>
      </div>
    );
  }
}

