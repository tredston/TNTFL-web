import * as React from 'react';
import { Component, Props } from 'react';
import * as request from 'request';

function PageNavigation(): JSX.Element {
  return (
    <div className="pageNavigation">
      <ul className="nav navbar-nav">
        <li><a href="/~tlr/tntfl-ui/">Home</a></li>
        <li><a href="/~tlr/tntfl-ui/slice.html">Slice</a></li>
        <li><a href="/~tlr/tntfl-ui/belt.html">Belt</a></li>
      </ul>
    </div>
  );
}

interface AddGameFormProps extends Props<AddGameForm> {
    addURL: string;
    onGameAdded: () => void;
}
interface AddGameFormState {
  redPlayer: string;
  redScore: number;
  bluePlayer: string;
  blueScore: number;
}
class AddGameForm extends Component<AddGameFormProps, AddGameFormState> {
  constructor(props: AddGameFormProps, context: any) {
    super(props, context)
    this.state = {
      redPlayer: '',
      redScore: 0,
      bluePlayer: '',
      blueScore: 0,
    };
  }
  handleRedPlayerChange(e: string) {
    this.setState({redPlayer: e} as AddGameFormState);
  }
  handleRedScoreChange(e: number) {
    this.setState({redScore: e, blueScore: 10 - e} as AddGameFormState);
  }
  handleBluePlayerChange(e: string) {
    this.setState({bluePlayer: e} as AddGameFormState);
  }
  handleBlueScoreChange(e: number) {
    this.setState({blueScore: e} as AddGameFormState);
  }
  handleSubmit(e: any) {
    const { addURL, onGameAdded } = this.props;
    e.preventDefault();
    var game = {redPlayer: this.state.redPlayer, redScore: this.state.redScore, bluePlayer: this.state.bluePlayer, blueScore: this.state.blueScore}
    request.post(addURL, {form: game}, (e, r, b) => onGameAdded());
    this.setState({redPlayer: '', redScore: 0, bluePlayer: '', blueScore: 0});
  }
  render() {
    return (
      <div className="addGameForm">
        <form className="navbar-form navbar-right game-entry" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="redPlayer"
              className="form-control red player"
              placeholder="Red"
              value={this.state.redPlayer}
              onChange={e => this.handleRedPlayerChange((e.target as any).value)}
            /> <input
              type="text"
              name="redScore"
              className="form-control red score"
              maxLength={2}
              placeholder="0"
              value={this.state.redScore}
              onChange={e => this.handleRedScoreChange((e.target as any).value)}
            /> - <input
              type="text"
              name="blueScore"
              className="form-control blue score"
              maxLength={2}
              placeholder="0"
              value={this.state.blueScore}
              onChange={e => this.handleBlueScoreChange((e.target as any).value)}
            /> <input
              type="text"
              name="bluePlayer"
              className="form-control blue player"
              placeholder="Blue"
              value={this.state.bluePlayer}
              onChange={e => this.handleBluePlayerChange((e.target as any).value)}
            /> <button
              type="submit" className="btn btn-default">
              Add game <span className="glyphicon glyphicon-triangle-right"/>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

interface NavigationBarProps {
  header: string;
  addURL: string;
  onGameAdded: () => void;
}
export default function NavigationBar(props: NavigationBarProps): JSX.Element {
  const { header, addURL, onGameAdded } = props;
  return (
    <div className="navigationBar">
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <p className="navbar-text tntfl-header">{header}</p>
          <PageNavigation/>
          <AddGameForm
            addURL={addURL}
            onGameAdded={onGameAdded}
          />
        </div>
      </nav>
    </div>
  );
}
