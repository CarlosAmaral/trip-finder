import * as React from "react";
import { connect } from "react-redux";
import "./styles/App.css";
import logo from "./logo.svg";
import { getDeals } from "./actions/dealsActions";

import Search from "./components/Search";
import Results from "./components/Results";

export interface IProps {
  getDeals: any;
}

export interface IState {
  id: string;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }
  public componentDidMount() {
    this.props.getDeals();
  }

  public render() {
    return (
      <div className="App">
        <div className="logo">
          <img src={logo} />
        </div>
        <Search />
        <Results />
      </div>
    );
  }
}

const mapDispatchToProps = {
  getDeals
};

export default connect(
  null,
  mapDispatchToProps
)(App);
