import React, { Component } from 'react';
import { Container } from "reactstrap";

import logo from './logo.svg';
import Message from "./Message";
import Button from "./Button";
import NewGame from "./Components/NewGame";
import PlayGame from "./Components/PlayGame";
import Loading from "./Components/Loading";
import Header from "./Components/Header";
import axios from "axios";
import './App.css';

class App extends Component {
  
  state = {
    showImg: true,
    num: 0,
    game: null,
    loading: true
  }

  componentDidMount() {
    if(window.location.pathname) {
      const pathParams = window.location.pathname.slice(1).split("/");
      console.log(pathParams);
      if(pathParams[1] && pathParams[0] === "game"){
        const questionId = pathParams[1];
        axios({
          url: `http://localhost:6969/api/game/${questionId}`,
          method: "GET"
        }).then(response => {
            console.log(response.data);
            if(response.data.success) {
              this.setState({ game: response.data.game, loading: false});
            }
        }).catch(error => {
          this.setState({ game: null, loading: false});
          console.log(error);
        })
      } else {
        this.setState({ loading: false, game: null})
      }
  }};

  addNewRow = () => {
    const { game } = this.state;
    game.scores = game.scores.map(score => [...score, 0]);
    this.setState({ loading: true });
    
    axios({
      method: "PUT",
      url: "http://localhost:6969/api/game",
      data: {
        gameId: game._id,
        scores: game.scores
      }
    }).then(response => {
      console.log(response);
      this.setState({ loading: false, game });
    }).catch(error => {
      console.error(error);
      this.setState({ loading: false });      
    }) 

  };

  updateScore = (score, playerIndex, rowIndex ) => {
    const { game } = this.state;
    game.scores[playerIndex][rowIndex] = score;
    this.setState({ game });
    
    axios({
      method: "PUT",
      url: "http://localhost:6969/api/game",
      data: {
        gameId: game._id,
        scores: game.scores
      }
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    })
  }

  render() {
    const { game, loading } = this.state;    
    return (
      <Container className="App">
        <Header />
        { loading ? <div className="text-center"><Loading /></div>
          : game ? <PlayGame game={game} addNewRow={this.addNewRow} updateScore={this.updateScore} />
                : <NewGame toggleLoading={(loading) => { this.setState({loading: loading}) }} />
        }
        {/* <header className="App-header">
          {this.state.showImg ? <img src={logo} className="App-logo" alt="logo" /> : "Hidden"}
          <div>
            { Edit <code>src/App.js</code> and save to reload. }
            { Hello World }
            <Message message = {"Hello World"} />
          </div>
          <div>
            <p>Click: {this.state.num}</p>
            <Button handleClick = {() => {
              this.setState({ num: this.state.num + 1})
            }} />
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </Container>
    );
  }
}

export default App;
