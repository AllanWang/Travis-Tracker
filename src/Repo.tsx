import React from 'react';
import List, {ListItem, ListItemGraphic, ListItemMeta, ListItemText} from '@material/react-list';
import Checkbox from '@material/react-checkbox';
import {BuildInfo, Repositories, Slug} from "./travis-api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Caption} from "@material/react-typography";
import {MapModifier, SetModifier} from "./state-modifier";
import {travisBuilds} from "./travis";

export interface ReposProps {
  repos: Repositories | null;
  subscriptions: Set<Slug>;
  buildModifier: MapModifier<Slug, BuildInfo>;
  subscriptionModifier: SetModifier<Slug>;
  buildFetchModifier: SetModifier<Slug>;
}

export interface ReposState {

}

export default class Repos extends React.Component<ReposProps, ReposState> {

  state: ReposState = {};

  private renderEmpty() {
    return (<span className={'no-results'}><Caption>No results found.</Caption></span>)
  }

  private renderRepos(repoProps: ListItemRepoProps[]) {
    const {subscriptionModifier, subscriptions} = this.props;
    const selectedIndex: number[] = [];
    repoProps.forEach((r, i) => {
      if (subscriptions.has(r.slug)) {
        selectedIndex.push(i)
      }
    });
    return (
      <List
        checkboxList
        selectedIndex={selectedIndex}
        handleSelect={(activatedItemIndex, allSelected) => {
          const slug = repoProps[activatedItemIndex].slug;
          // While type is MDCListIndex, it appears to always be an array for checkbox lists
          // See isIndexValid_(index: MDCListIndex)
          if ((allSelected as number[]).includes(activatedItemIndex)) {
            subscriptionModifier.add(slug)
          } else {
            subscriptionModifier.remove(slug)
          }
          this.setState({selectedIndex: allSelected})
        }}
      > {repoProps
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

export interface ListItemRepoProps {
  owner: string;
  repo: string;
  slug: Slug;
  checked?: boolean;
  buildModifier: MapModifier<Slug, BuildInfo>;
  buildFetchModifier: SetModifier<Slug>;
}

const buildCacheTime = 10 * 60 * 1000;

export class ListItemRepo extends React.Component<ListItemRepoProps> {

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
    const {owner, repo, slug, checked, buildModifier} = this.props;
    const blankTarget = {target: '_blank', rel: 'noopener noreferrer'};

    const buildInfo = buildModifier.get().get(slug);

    const userA = <a {...blankTarget}
                     href={`https://github.com/${owner}`}>{owner}</a>;
    const repoA = <a {...blankTarget}
                     href={`https://github.com/${slug}`}>{repo}</a>;
    return (
      <ListItem className={buildInfo ? `travis-build-${buildInfo.build.state}` : undefined}>
        <ListItemGraphic className={'build-theme'} graphic={<FontAwesomeIcon icon={['fab', 'github']}/>}/>
        <ListItemText primaryText={<div>{userA}/{repoA}</div>}/>
        <ListItemMeta meta={<Checkbox checked={checked}/>}/>
      </ListItem>
    );
  }
}
