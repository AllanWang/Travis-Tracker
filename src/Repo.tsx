import React from 'react';
import List, {ListItem, ListItemGraphic, ListItemMeta, ListItemText} from '@material/react-list';
import Checkbox from '@material/react-checkbox';
import {Repositories, Slug, TravisState} from "./travis_api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Caption} from "@material/react-typography";

export interface ReposProps {
  repos?: Repositories | null;
  subscriptions: Set<Slug>;
  addRepoSubscription: (slug: Slug) => void;
  removeRepoSubscription: (slug: Slug) => void;
}

export interface ReposState {

}

export default class Repos extends React.Component<ReposProps, ReposState> {

  state: ReposState = {};

  private renderEmpty() {
    return (<span className={'no-results'}><Caption>No results found.</Caption></span>)
  }


  private renderRepos(repoProps: ListItemRepoProps[]) {
    const {addRepoSubscription, removeRepoSubscription, subscriptions} = this.props;
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
          // While type is MDCListIndex, it appears to always be an array for checkbox lists
          // See isIndexValid_(index: MDCListIndex)
          if ((allSelected as number[]).includes(activatedItemIndex)) {
            addRepoSubscription(repoProps[activatedItemIndex].slug)
          } else {
            removeRepoSubscription(repoProps[activatedItemIndex].slug)
          }
          this.setState({selectedIndex: allSelected})
        }}
        style={{width: '600px'}}
      > {repoProps
        .map((r, i) => ({...r, checked: selectedIndex.includes(i)}))
        .map(r => <ListItemRepo {...r} key={r.slug}/>)}
      </List>
    );
  }

  render() {
    const {repos} = this.props;

    if (!repos) {
      return this.renderEmpty();
    }
    return this.renderRepos(repos.repositories.map(r => ({owner: r.owner.login, repo: r.name, slug: r.slug})))
  }
}

export interface ListItemRepoProps {
  owner: string;
  repo: string;
  slug: Slug;
  checked?: boolean;
  status?: TravisState
}

export const ListItemRepo: React.FunctionComponent<ListItemRepoProps> = ({owner, repo, checked, status}) => {

  const blankTarget = {target: '_blank', rel: 'noopener noreferrer'};

  const userA = <a {...blankTarget}
                   href={`https://github.com/${owner}`}>{owner}</a>;
  // TODO verify that this works for organizations
  const repoA = <a {...blankTarget}
                   href={`https://github.com/${owner}/${repo}`}>{repo}</a>;
  return (
    <ListItem className={status ? `travis-build-${status}` : undefined}>
      <ListItemGraphic className={'build-theme'} graphic={<FontAwesomeIcon icon={['fab', 'github']}/>}/>
      <ListItemText primaryText={<div>{userA}/{repoA}</div>}/>
      <ListItemMeta meta={<Checkbox checked={checked}/>}/>
    </ListItem>
  );
};
