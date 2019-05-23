import React from 'react';
import './App.scss';
import Repos from "./Repo";
import SearchBar from "./SearchBar";
import {BuildInfo, Repositories, Slug} from "./travis-api";
import {MapModifier, SetModifier} from "./state-modifier";


interface SearchPanelProps {
  setRepos: (repos: Repositories | null) => void
  repos: Repositories | null;
  subscriptions: Set<Slug>;
  buildModifier: MapModifier<Slug, BuildInfo>;
  subscriptionModifier: SetModifier<Slug>;
  buildFetchModifier: SetModifier<Slug>;
}

export default class SearchPanel extends React.Component<SearchPanelProps> {
  render() {
    return (
      <div className="App">
        <SearchBar {...this.props}/>
        <Repos {...this.props}/>
      </div>
    );
  }
}

