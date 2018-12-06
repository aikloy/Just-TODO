import * as React from 'react';
import { Text, View, TextInput, StyleSheet, Dimensions, Platform, StatusBar, ScrollView, AsyncStorage } from 'react-native';
import { Constants, AppLoading } from 'expo';
import ToDo from "./ToDo"

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import uuidv1 from "uuid/v1"

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTODO: "",
    loadedToDos: false,
    toDos: {}
  }
  componentDidMount = () => {
    this._loadToDos();
  }
  render() {
    const { newTODO, loadedToDos, toDos } = this.state;
    if (!loadedToDos){
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>Just TODO</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder={"New TODO"} value={newTODO} onChangeText={this._controlNewTODO} placeholderTextColor={"#999"} returnKeyType={"done"} onSubmitEditing={this._addToDo}/>
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(toDo => <ToDo key={toDo.id} {...toDo} deleteToDo={this._deleteToDo} completeToDo={this._completeToDo} uncompleteToDo={this._uncompleteToDo} updateToDo={this._updateToDo}/>)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewTODO = text => {
    this.setState({
      newTODO: text
    })
  }

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos)
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {}
      })
    } catch(err){
      console.log(err)
    }
    // this.setState({
    //     loadedToDos: true
    //   })
  }

  _addToDo = () => {
    const { newTODO } = this.state;
    if (newTODO !== ""){
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTODO,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTODO: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return {...newState};
      })
    }
  }

  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }

  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }

  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }

  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F23657",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});