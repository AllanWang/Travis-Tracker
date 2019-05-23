import React, {Component} from 'react';
import List, {ListItem, ListItemGraphic, ListItemMeta, ListItemText} from '@material/react-list';
import Checkbox from '@material/react-checkbox';
import MaterialIcon from "@material/react-material-icon";
import {Repositories} from "./travis_api";

export class ReposProps {
  repos: ListItemRepoProps[];

  constructor(repos: ListItemRepoProps[] | Repositories) {
    if (repos instanceof Repositories) {
      this.repos = repos.repositories.map(r => ({name: r.owner.name, repo: r.name}));
    } else {
      this.repos = repos;
    }
  }
}

const repoKey = ({name, repo}: ListItemRepoProps) => `repo/${name}/${repo}`;

export class Repos extends Component<ReposProps> {

  state = {
    selectedIndex: [1],
  };

  render() {
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
      > {this.props.repos
      // While type is MDCListIndex, it appears to always be an array for checkbox lists
      // See isIndexValid_(index: MDCListIndex)
        .map((r, i) => ({...r, checked: selectedIndex.includes(i)}))
        .map(r => <ListItemRepo {...r} key={repoKey(r)}/>)}
      </List>
    );
  }
}

export interface ListItemRepoProps {
  name: string;
  repo: string;
  checked?: boolean;
}

export const ListItemRepo: React.FunctionComponent<ListItemRepoProps> = ({name, repo, checked}) => {

  const blankTarget = {target: '_blank', rel: 'noopener noreferrer'};

  const userA = <a {...blankTarget}
                   href={`https://github.com/${name}`}>{name}</a>;
  const repoA = <a {...blankTarget}
                   href={`https://github.com/${name}/${repo}`}>{repo}</a>;
  return (
    <ListItem>
      <ListItemGraphic graphic={<MaterialIcon icon='public'/>}/>
      <ListItemText primaryText={<div>{userA}/{repoA}</div>}/>
      <ListItemMeta meta={<Checkbox checked={checked}/>}/>
    </ListItem>
  );
};

export default Repos
