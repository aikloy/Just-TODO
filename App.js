import * as React from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import { Constants, AppLoading, SplashScreen } from 'expo';
import TodoComponent from './js code/TodoComponent';
import uuidv1 from 'uuid/v1';

const { height, width } = Dimensions.get('window');

export default class App extends React.Component {

  state = {
    newTODO: '',
    loadedToDos: false,
    toDos: {},
  };
  componentDidMount = () => {
    this._loadToDos();
    SplashScreen.preventAutoHide();
  };
  render() {
    const { newTODO, loadedToDos, toDos } = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
      <StatusBar hidden />
        <View style={styles.backboard}>
          <TextInput
            style={styles.inputBar}
            placeholder={'New TODO'}
            value={newTODO}
            onChangeText={this._controlNewTODO}
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.todoList}>
            {Object.values(toDos)
              .reverse()
              .map(toDo => (
                <TodoComponent
                  key={toDo.id}
                  {...toDo}
                  deleteToDo={this._deleteToDo}
                  completeToDo={this._completeToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  updateToDo={this._updateToDo}
                />
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewTODO = text => {
    this.setState({
      newTODO: text,
    });
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem('toDos');
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {},
      });
    } catch (err) {
      console.log(err);
    }
  };

  _addToDo = () => {
    const { newTODO } = this.state;
    if (newTODO !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTODO,
            createdAt: Date.now(),
          },
        };
        const newState = {
          ...prevState,
          newTODO: '',
          toDos: {
            ...prevState.toDos,
            ...newToDoObject,
          },
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };

  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos,
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {...prevState};
      newState.toDos[id] = {
        ...prevState.toDos[id],
        isCompleted: false
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {...prevState};
      newState.toDos[id] = {
        ...prevState.toDos[id],
        isCompleted: true
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {...prevState};
      newState.toDos[id] = {
        ...prevState.toDos[id],
        text: text
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem('toDos', JSON.stringify(newToDos));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#799cf2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backboard: {
    backgroundColor: 'white',
    width: width - 25,
    height: height - 25,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputBar: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 25,
  },
  todoList: {
    alignItems: 'center',
  },
});
