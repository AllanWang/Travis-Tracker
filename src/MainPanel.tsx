import React from 'react';
import './App.scss';
import {BuildInfo, Repositories, Slug} from "./travis-api";
import {MapModifier, SetModifier} from "./state-modifier";
import {Caption} from "@material/react-typography";
import List, {ListItem, ListItemGraphic, ListItemMeta, ListItemText} from "@material/react-list";
import {travisBuilds} from "./travis";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Fab} from "@material/react-fab";
import MaterialIcon from "@material/react-material-icon";
import {TravisPanel} from "./const";
import classNames from "classnames";


interface MainPanelProps {
  setRepos: (repos: Repositories | null) => void;
  setPanel: (p: TravisPanel) => void;
  subscriptions: Set<Slug>;
  buildModifier: MapModifier<Slug, BuildInfo>;
  buildFetchModifier: SetModifier<Slug>;
}

export default class MainPanel extends React.Component<MainPanelProps> {
  render() {
    const {setPanel} = this.props;
    return (
      <div className='MainPanel'>
        <Repos {...this.props}/>
        <Fab className='add-fab' icon={<MaterialIcon icon='add'/>} onClick={() => setPanel('search')}/>
      </div>
    );
  }
}


interface ReposProps {
  subscriptions: Set<Slug>;
  buildModifier: MapModifier<Slug, BuildInfo>;
  buildFetchModifier: SetModifier<Slug>;
}

interface ReposState {

}

class Repos extends React.Component<ReposProps, ReposState> {

  state: ReposState = {};


  private buildCompareVal(b: BuildInfo): number {
    if (b.build.finishedAt) {
      return b.build.finishedAt.getTime()
    }
    if (b.build.startedAt) {
      return b.build.startedAt.getTime()
    }
    return -1;
  }


  render() {
    const {subscriptions, buildModifier} = this.props;

    const buildMap = buildModifier.get();
    const builds: BuildInfo[] = [];
    subscriptions.forEach(s => {
      const b = buildMap.get(s);
      if (b) {
        builds.push(b)
      }
    });
    if (builds.length === 0) {
      return (<span className={'no-results'}><Caption>No repositories added.</Caption></span>);
    }
    builds.sort((a, b) => this.buildCompareVal(b) - this.buildCompareVal(a));
    return (
      <List twoLine> {builds
        .map(b => <ListItemBuild buildInfo={b} {...this.props} key={b.build.repository.slug}/>)}
      </List>
    );
  }
}

interface ListItemBuildProps {
  buildInfo: BuildInfo;
  buildModifier: MapModifier<Slug, BuildInfo>;
  buildFetchModifier: SetModifier<Slug>;
}

const buildCacheTime = 10 * 60 * 1000;

class ListItemBuild extends React.Component<ListItemBuildProps> {

  async loadBuild() {
    const {buildInfo, buildModifier, buildFetchModifier} = this.props;
    const slug = buildInfo.build.repository.slug;
    if (buildFetchModifier.get().has(slug)) {
      return
    }
    const now = new Date().getTime();
    if (buildInfo.fetchTime > now - buildCacheTime) {
      return
    }
    buildFetchModifier.add(slug);
    const builds = await travisBuilds(slug).finally(() => buildFetchModifier.remove(slug));
    if (!builds || builds.builds.length === 0) {
      return
    }
    const newBuildInfo = new BuildInfo();
    newBuildInfo.build = builds.builds[0];
    newBuildInfo.fetchTime = new Date().getTime();
    buildModifier.add(slug, newBuildInfo);
  }

  componentDidMount() {
    this.loadBuild()
  }

  durationString(duration: number): string {
    const seconds = duration % 60 === 0 ? null : `${duration % 60} sec`;
    duration = Math.floor(duration / 60);
    const minutes = duration % 60 === 0 ? null : `${duration % 60} min`;
    duration = Math.floor(duration / 60);
    const hours = duration === 0 ? null : `${duration} hrs`;
    return [hours, minutes, seconds].filter(s => s !== null).join(' ');
  }

  render() {
    const {buildInfo} = this.props;

    const b = buildInfo.build;

    const slug = b.repository.slug;

    const blankTarget = {target: '_blank', rel: 'noopener noreferrer'};

    const buildA = <a className={classNames('build-theme', 'hover-underline')} {...blankTarget}
                      href={`https://travis-ci.com/${slug}`}>{slug}</a>;

    const durationEl = b.duration ? <span className='build-description'>
      <MaterialIcon icon={'access_time'}/>Duration: {this.durationString(b.duration)}
    </span> : null;

    const finishedEl = b.finishedAt ? <span className='build-description'>
      <MaterialIcon icon={'calendar_today'}/>Finished: {b.finishedAt.toISOString()}
    </span> : null;

    const buildNumEl = <span># <a className={classNames('build-theme', 'hover-underline')}
                                  {...blankTarget}
                                  href={`https://travis-ci.com/${b.repository.slug}/builds/${b.id}`}>{b.number}</a>
    </span>;

    return (
      <ListItem className={buildInfo ? `travis-build-${buildInfo.build.state}` : undefined}>
        <ListItemGraphic className={'build-theme'}
                         graphic={<a {...blankTarget} href={`https://github.com/${slug}`}><FontAwesomeIcon
                           icon={['fab', 'github']}/></a>}/>
        <ListItemText primaryText={buildA} secondaryText={durationEl}/>
        <ListItemMeta meta={<ListItemText primaryText={buildNumEl} secondaryText={finishedEl}/>}/>
      </ListItem>
    );
  }
}
