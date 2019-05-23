import React from 'react';
import List, {ListItem, ListItemGraphic, ListItemMeta, ListItemText} from '@material/react-list';
import Checkbox from '@material/react-checkbox';
import {TravisState} from "./travis_api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface ReposProps {
  repos?: ListItemRepoProps[];
}

const repoKey = ({owner, repo}: ListItemRepoProps) => `repo/${owner}/${repo}`;

export default class Repos extends React.Component<ReposProps> {

  state = {
    selectedIndex: [1],
  };

  renderNothing() {
    return null
  }

  renderRepos(repos: ListItemRepoProps[]) {
    const {selectedIndex} = this.state;
    return (
      <List
        checkboxList
        selectedIndex={selectedIndex}
        handleSelect={(_, allSelected) => {
          console.log(allSelected);
          this.setState({selectedIndex: allSelected})
        }}
        style={{width: '600px'}}
      > {repos
      // While type is MDCListIndex, it appears to always be an array for checkbox lists
      // See isIndexValid_(index: MDCListIndex)
        .map((r, i) => ({...r, checked: selectedIndex.includes(i)}))
        .map(r => <ListItemRepo {...r} key={repoKey(r)}/>)}
      </List>
    );
  }

  render() {
    const {repos} = this.props;

    if (!repos) {
      return this.renderNothing();
    }
    return this.renderRepos(repos)
  }
}

export interface ListItemRepoProps {
  owner: string;
  repo: string;
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
