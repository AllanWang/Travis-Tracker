import React, {FormEvent, KeyboardEvent} from 'react';
import './App.scss';
import {BuildInfo, Repositories, Slug} from "./travis-api";
import {MapModifier, SetModifier} from "./state-modifier";
import {Caption} from "@material/react-typography";
import List, {ListItem, ListItemGraphic, ListItemMeta} from "@material/react-list";
import {travisBuilds, travisRepo, travisRepos} from "./travis";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Checkbox from "@material/react-checkbox";
import TextField, {HelperText, Input} from "@material/react-text-field";
import MaterialIcon from "@material/react-material-icon";
import {RepoListItemText} from "./RepoComponents";


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
      <div className='SearchPanel'>
        <SearchBar {...this.props}/>
        <Repos {...this.props}/>
      </div>
    );
  }
}

interface SearchBarProps {
  setRepos: (repos: Repositories | null) => void
}

type SearchBarState = {
  value?: string
  searchKey?: string
  searchResults: Record<string, string>
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {

  input: React.Ref<HTMLInputElement> = null;
  state: SearchBarState = {
    searchResults: {}
  };

  private async search() {
    let {value, searchKey} = this.state;
    value = value ? value.trim() : undefined;
    if (!value || searchKey === value) {
      return;
    }
    this.setState({searchKey: value});
    if (value.includes('/')) {
      const repo = await travisRepo(value);
      this.props.setRepos(repo ? Repositories.fromSingle(repo) : null)
    } else {
      const repos = await travisRepos(value);
      this.props.setRepos(repos);
    }
  }

  render() {
    const {value} = this.state;
    return (
      <TextField label='Repo Search'
        // leadingIcon={<MaterialIcon icon='search'/>}
                 helperText={<HelperText>Enter [username] or [username/repo]</HelperText>}
                 onTrailingIconSelect={() => this.setState({value: ''})}
                 trailingIcon={<MaterialIcon role='button' icon='close'/>}>
        <Input
          value={value}
          onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.charCode === 13) this.search();
          }}
          ref={(input: any) => this.input = input}
          onChange={(e: FormEvent<HTMLInputElement>) => this.setState({value: e.currentTarget.value})}/>
      </TextField>
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

interface ListItemRepoProps {
  owner: string;
  repo: string;
  slug: Slug;
  checked?: boolean;
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
    const {slug, checked, buildModifier} = this.props;

    const buildInfo = buildModifier.get().get(slug);

    return (
      <ListItem className={buildInfo ? `travis-build-${buildInfo.build.state}` : undefined}>
        <ListItemGraphic className={'build-theme'} graphic={<FontAwesomeIcon icon={['fab', 'github']}/>}/>
        <RepoListItemText {...this.props} />
        <ListItemMeta meta={<Checkbox checked={checked}/>}/>
      </ListItem>
    );
  }
}
