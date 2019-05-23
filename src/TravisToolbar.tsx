import React from 'react';
import './App.scss';
import {TravisPanel} from "./const";
import TopAppBar, {TopAppBarIcon, TopAppBarRow, TopAppBarSection, TopAppBarTitle} from "@material/react-top-app-bar";
import MaterialIcon from "@material/react-material-icon";


interface TravisToolbarProps {
  panel: TravisPanel
  setPanel: (panel: TravisPanel) => void
}

export default class TravisToolbar extends React.Component<TravisToolbarProps> {
  render() {
    const {setPanel} = this.props;
    return (
      <TopAppBar>
        <TopAppBarRow>
          <TopAppBarSection align='start'>
            <TopAppBarIcon navIcon tabIndex={0}>
              <MaterialIcon hasRipple icon='home' onClick={() => setPanel('main')}/>
            </TopAppBarIcon>
            <TopAppBarTitle>Travis Tracker</TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection align='end' role='toolbar'>
            <TopAppBarIcon actionItem tabIndex={0}>
              <MaterialIcon
                aria-label="refresh"
                hasRipple
                icon='refresh'
                onClick={() => console.log('refresh')}
              />
            </TopAppBarIcon>
            <TopAppBarIcon actionItem tabIndex={0}>
              <MaterialIcon
                aria-label="overflow menu"
                hasRipple
                icon='more_vert'
                onClick={() => console.log('more')}
              />
            </TopAppBarIcon>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
    );
  }
}

