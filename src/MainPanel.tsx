import React from 'react';
import './App.scss';
import {BuildInfo, Repositories, Slug} from "./travis-api";
import {MapModifier, SetModifier} from "./state-modifier";
import {Caption} from "@material/react-typography";
import List, {ListItem, ListItemGraphic} from "@material/react-list";
import {travisBuilds} from "./travis";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {RepoListItemText} from "./RepoComponents";


interface MainPanelProps {
  setRepos: (repos: Repositories | null) => void
  repos: Repositories | null;
  subscriptions: Set<Slug>;
  buildModifier: MapModifier<Slug, BuildInfo>;
  subscriptionModifier: SetModifier<Slug>;
  buildFetchModifier: SetModifier<Slug>;
}

export default class MainPanel extends React.Component<MainPanelProps> {
  render() {
    return (
      <div className='MainPanel'>
        <Repos {...this.props}/>
      </div>
    );
  }
}


interface ReposProps {
  repos: Repositories | null;
  subscriptions: Set<Slug>;
  buildModifier: MapModifier<Slug, BuildInfo>;
  subscriptionModifier: SetModifier<Slug>;
  buildFetchModifier: SetModifier<Slug>;
}

interface ReposState {

}

class Repos extends React.Component<ReposProps, ReposState> {

  state: ReposState = {};

  private renderEmpty() {
    return (<span className={'no-results'}><Caption>No repositories added.</Caption></span>)
  }

  private renderRepos(repoProps: ListItemRepoProps[]) {
    const {subscriptions} = this.props;
    const selectedIndex: number[] = [];
    repoProps.forEach((r, i) => {
      if (subscriptions.has(r.slug)) {
        selectedIndex.push(i)
      }
    });
    return (
      <List> {repoProps
        .map((r, i) => ({...r, checked: selectedIndex.includes(i)}))
        .map(r => <ListItemRepo {...r} key={r.slug}/>)}
      </List>
    );
  }

  render() {
    const {repos, buildModifier, buildFetchModifier} = this.props;

    if (!repos) {
      return this.renderEmpty();
    }
    return this.renderRepos(repos.repositories.map(r => ({
      owner: r.owner.login,
      repo: r.name,
      slug: r.slug,
      buildModifier: buildModifier,
      buildFetchModifier: buildFetchModifier
    })))
  }
}

interface ListItemRepoProps {
  owner: string;
  repo: string;
  slug: Slug;
  buildModifier: MapModifier<Slug, BuildInfo>;
  buildFetchModifier: SetModifier<Slug>;
}

const buildCacheTime = 10 * 60 * 1000;

class ListItemRepo extends React.Component<ListItemRepoProps> {

  async loadBuild() {
    const {slug, buildModifier, buildFetchModifier} = this.props;
    if (buildFetchModifier.get().has(slug)) {
      return
    }
    const now = new Date().getTime();
    const lastBuildInfo = buildModifier.get().get(slug);
    if (lastBuildInfo && lastBuildInfo.fetchTime > now - buildCacheTime) {
      return
    }
    buildFetchModifier.add(slug);
    const builds = await travisBuilds(slug).finally(() => buildFetchModifier.remove(slug));
    if (!builds || builds.builds.length === 0) {
      return
    }
    const buildInfo = new BuildInfo();
    buildInfo.build = builds.builds[0];
    buildInfo.fetchTime = new Date().getTime();
    buildModifier.add(slug, buildInfo);
  }

  componentDidMount() {
    this.loadBuild()
  }

  render() {
    const {slug, buildModifier} = this.props;

    const buildInfo = buildModifier.get().get(slug);

    return (
      <ListItem className={buildInfo ? `travis-build-${buildInfo.build.state}` : undefined}>
        <ListItemGraphic className={'build-theme'} graphic={<FontAwesomeIcon icon={['fab', 'github']}/>}/>
        <RepoListItemText {...this.props} />
      </ListItem>
    );
  }
}
