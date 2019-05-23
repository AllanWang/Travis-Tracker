import React, {FormEvent, KeyboardEvent} from 'react';
import TextField, {Input} from "@material/react-text-field";
import MaterialIcon from "@material/react-material-icon";
import {travisRepos} from "./travis";
import {Repositories} from "./travis_api";

export interface SearchBarProps {
  setRepos: (repos: Repositories | null) => void
}

type SearchBarState = {
  value?: string
  searchKey?: string
  searchResults: Record<string, string>
}

export default class SearchBar extends React.Component<SearchBarProps, SearchBarState> {

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
    console.log('Search');
    const repos = await travisRepos(value);
    this.props.setRepos(repos);
  }

  render() {

    const {value} = this.state;
    return (
      <TextField label='Repo Search' leadingIcon={<MaterialIcon icon='search'/>}
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
