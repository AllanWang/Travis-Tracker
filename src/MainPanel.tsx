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
import {Ablank} from "./components";


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
      <List twoLine className='travis-build-list'> {builds
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

  private static durationString(duration: number): string {
    const seconds = duration % 60 === 0 ? null : `${duration % 60} sec`;
    duration = Math.floor(duration / 60);
    const minutes = duration % 60 === 0 ? null : `${duration % 60} min`;
    duration = Math.floor(duration / 60);
    const hours = duration === 0 ? null : `${duration} hrs`;
    return [hours, minutes, seconds].filter(s => s !== null).join(' ');
  }

  /**
   * TODO find a library that does this?
   */
  private static agoString(date: number): string {
    let diff = Date.now() - date;
    diff = Math.floor(diff / 1000);
    if (diff < 20) {
      return 'a few seconds ago'
    }
    if (diff < 60) {
      return `${diff} seconds ago`
    }
    diff = Math.floor(diff / 60);
    if (diff < 60) {
      return `${diff} minutes ago`
    }
    diff = Math.floor(diff / 60);
    if (diff <= 1) {
      return 'about an hour ago'
    }
    if (diff < 24) {
      return `about ${diff} hours ago`
    }
    diff = Math.floor(diff / 24);
    if (diff <= 1) {
      return 'a day ago'
    }
    if (diff < 30) {
      return `${diff} days ago`
    }
    diff = Math.floor(diff / 30.416);
    if (diff <= 1) {
      return 'about a month ago'
    }
    if (diff < 12) {
      return `${diff} months ago`
    }
    diff = Math.floor(diff / 12);
    if (diff <= 1) {
      return 'about a year ago'
    }
    return `${diff} years ago`
  }

  render() {
    const {buildInfo} = this.props;

    const b = buildInfo.build;

    const slug = b.repository.slug;

    const buildA = <Ablank className={classNames('build-theme', 'hover-underline')}
                           href={`https://travis-ci.com/${slug}`}>{slug}</Ablank>;

    const durationEl = b.duration ? <span className='build-description'>
      <MaterialIcon icon={'access_time'}/>Duration: {ListItemBuild.durationString(b.duration)}
    </span> : null;

    const finishedEl = <span className='build-description'>{b.finishedAt ? [<MaterialIcon
      icon={'check'}/>, ListItemBuild.agoString(b.finishedAt.getTime())] : '--'}  </span>;

    const buildNumEl = <span># <Ablank className={classNames('build-theme', 'hover-underline')}
                                       href={`https://travis-ci.com/${b.repository.slug}/builds/${b.id}`}>{b.number}</Ablank>
    </span>;

    return (
      <ListItem className={buildInfo ? `travis-build-${buildInfo.build.state}` : undefined}>
        <ListItemGraphic className={'build-theme'}
                         graphic={<Ablank href={`https://github.com/${slug}`}><FontAwesomeIcon
                           icon={['fab', 'github']}/></Ablank>}/>
        <ListItemText primaryText={buildA} secondaryText={durationEl}/>
        <ListItemMeta meta={<ListItemText primaryText={buildNumEl} secondaryText={finishedEl}/>}/>
      </ListItem>
    );
  }
}
