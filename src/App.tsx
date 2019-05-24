import React, {ReactNode} from 'react';
import './App.scss';
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {BuildInfo, Repositories, Slug} from "./travis-api";
import TravisStorage from "./travis-storage";
import {MapModifier, SetModifier} from "./state-modifier";
import SearchPanel from "./SearchPanel";
import TravisToolbar from "./TravisToolbar";
import {TopAppBarFixedAdjust} from "@material/react-top-app-bar";
import {TravisPanel} from "./const";
import MainPanel from "./MainPanel";

library.add(fas, fab);

interface AppProps {
}

interface AppState {
  panel: TravisPanel
  repos: Repositories | null
  subscriptions: Set<Slug>
  builds: Map<Slug, BuildInfo>
  buildsFetching: Set<Slug>
}

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.setRepos = this.setRepos.bind(this);
  }

  state: AppState = {
    repos: null,
    panel: TravisStorage.panel.get(),
    subscriptions: TravisStorage.subscriptions.get(),
    builds: TravisStorage.builds.get(),
    buildsFetching: new Set<Slug>()
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

  private buildFetchModifier = new (class extends SetModifier<Slug, AppState> {
    get(): Set<string> {
      return this.component.state.buildsFetching;
    }

    set(data: Set<string>): void {
      this.component.setState({buildsFetching: data});
    }
  })(this);

  private panel(): ReactNode {
    const collection = {
      ...this.state,
      ...this.props,
      setRepos: this.setRepos,
      buildModifier: this.buildModifier,
      subscriptionModifier: this.subscriptionModifier,
      buildFetchModifier: this.buildFetchModifier
    };
    switch (this.state.panel) {
      case "main":
        return <MainPanel {...collection} />;
      case "search":
        return <SearchPanel {...collection} />;
    }
  }

  render() {
    const {panel} = this.state;
    return (
      <div className="App">
        <TravisToolbar panel={panel} setPanel={p => {
          this.setState({panel: p});
          TravisStorage.panel.set(p);
        }}/>
        <TopAppBarFixedAdjust>
          {this.panel()}
        </TopAppBarFixedAdjust>
      </div>
    );
  }
}

