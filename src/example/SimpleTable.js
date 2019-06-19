// import '../lib/react-ui-tree.css';
import './app.css';
import React, { Component } from 'react';
import {Paper, Hidden} from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ReactHtmlParser from 'react-html-parser';
import { withStyles } from '@material-ui/core/styles';
import userList from './userData'
const styles ={
  selectedListItem: {
    '&:hover': {
      background: "#fffedd",
    },
    '&:focus': {
      background: "#fffedd",
    },
    background: "#fffedd",
  },
  listItem: {
    '&:hover': {
      background: "white",
    },
    '&:focus': {
      background: "white",
    },
    background: "white",
  },
  focusdClass: {
    background: "#fffedd",
  }
};

class SimpelTabs extends Component {

  constructor(props) {
    super(props);
    this.state =  {
      allUserList: userList,
      filterdResult: [],
      selectedRowSerialNo: 0,
      searchText: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSearchResult = this.getSearchResult.bind(this);
    this.search = this.search.bind(this);
    this.onHover = this.onHover.bind(this);
  }
  
  componentDidMount() {
    document.onkeydown = (e) => {
      e = e || window.event;

      if (e.keyCode == '38' && this.state.selectedRowSerialNo > 1) {
        this.setState({selectedRowSerialNo : this.state.selectedRowSerialNo - 1}, () => {
          this.focusElementWithSerialNo(this.state.selectedRowSerialNo);
        });
      }
      else if (e.keyCode == '40' && this.state.selectedRowSerialNo < this.state.filterdResult.length) {
          // down arrow
          this.setState({selectedRowSerialNo : this.state.selectedRowSerialNo + 1}, () => {
            this.focusElementWithSerialNo(this.state.selectedRowSerialNo);
          });
      }
    }
  }

  handleSubmit() {
      this.setState({error: "", issues: {}, loading: true});
      fetch(`/fetch-data?url=${this.state.url}`).then((res) => {
        return res.json();
      }).then((res) => {
        if(res.message) {
          this.setState({error: res.message, loading: false});
        } else {
          this.setState({issues: res, loading: false});
        }
      });
  }

  render() {
    const {classes} = this.props;
    return (
      <div className="app">
        <Paper style={{width: '600px', height: '500px', marginLeft: '30%', marginTop: "100px", padding: '20px'}}>
            <IconButton aria-label="Search">
              <SearchIcon />
            </IconButton>
            <InputBase
              value={this.state.searchText}
              placeholder="Search user by Id, address, name"
              inputProps={{ 'aria-label': 'Search user by Id, address, name' }}
              onChange={this.search}
              style={{width: '450px'}}
            />
            <IconButton aria-label="Close" onClick={() => this.setState({searchText: ''})}>
              <CloseIcon />
            </IconButton>
            {this.state.searchText && <Paper style={{width: '100%', height: '300px', overflow: 'hidden', overflowY: 'auto'}}>
              {this.state.filterdResult.length ? <List>
                {this.state.filterdResult.map( u => (
                  <ListItem button
                  focusVisibleClassName="focusdClass"
                  onMouseOver={() => this.onHover(u)}
                  id={u.id}
                  className={this.state.selectedRowSerialNo == u.srNo ? classes.selectedListItem : classes.listItem}>
                    <div>
                      <div className="userId">{ReactHtmlParser (u.id)}</div>
                      <div className="userName"><i>{ReactHtmlParser (u.name)}</i></div>
                      <div className="userAddress">{ReactHtmlParser (u.address)}</div>
                    </div>
                  </ListItem>
                ))}
              </List> : <div className="noUserFound"><h3 style={{ position: "relative", top: '40%', left: '37%', color: 'gray'}}>No User Found</h3></div>}
            </Paper>}
            <Divider  />
        </Paper>
      </div>
    );
  }

  focusElementWithSerialNo(srNo) {
    this.state.filterdResult.forEach(element => {
      if(element.srNo === srNo) {
        document.getElementById(element.id).focus();
      }
    });
  }

  onHover(user) {
    this.setState({selectedRowSerialNo: user.srNo});
    document.getElementById(user.id).focus();
  }

  search(e) {
    this.setState({searchText: e.target.value});
    this.getSearchResult(e.target.value);
  }

  getSearchResult(text) {
    let filterdResult = [];
    const allUser = JSON.parse(JSON.stringify(this.state.allUserList));
    filterdResult = allUser.filter(u => JSON.stringify(u).toLowerCase().indexOf(text.toLowerCase()) >= 0);
    var i = 1;
    filterdResult = filterdResult.map(u => {
      u.srNo = i++;
      u.id = u.id.replace(new RegExp(text, "ig"), "<span class='highlight'>" + text +"</span>")
      u.name = u.name.replace(new RegExp(text, "ig"), "<span class='highlight'>" + text +"</span>")
      u.address = u.address.replace(new RegExp(text, "ig"), "<span class='highlight'>" + text +"</span>")
      return u;
    })
    this.setState({filterdResult: filterdResult, selectedRowSerialNo: 0});
  }

  handleChange = tree => {
    this.setState({
      tree: tree
    });
  };

}

export default withStyles(styles)(SimpelTabs);
