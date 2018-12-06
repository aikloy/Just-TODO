import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component{
  constructor(props){
    super(props);
    this.state = {isEditing: false, toDoValue: props.text};
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    completeToDo: PropTypes.func.isRequired,
    uncompleteToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired
  }
  render(){
    const {isEditing, toDoValue} = this.state;
    const { text, id, deleteToDo, isCompleted } = this.props; 
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]} />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
            style={[styles.text, styles.input, isCompleted ? styles.completedText : styles.uncompletedText]}
            value={toDoValue}
            multiline={true}
            onChangeText={this._controlInput}
            returnKeyType={"done"}
            onBlur={this._finishEditing}/>
          ) : (
            <Text
            style={[styles.text, isCompleted ? styles.completedText : styles.uncompletedText]}>{text}</Text>
          )}
        </View>
          {isEditing ? (
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._finishEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>V</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._startEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>A</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPressOut={(event) => {event.stopPropagation; deleteToDo(id)}} >
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>X</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
      </View>
    );
  }

  _toggleComplete = (event) => {
    event.stopPropagation();
    const { isCompleted, completeToDo, uncompleteToDo, id } = this.props;
    if (isCompleted){
      uncompleteToDo(id)
    } else {
      completeToDo(id)
    }
  }

  _startEditing = (event) => {
    event.stopPropagation();
    this.setState({
      isEditing: true
    })
  }

  _finishEditing = (event) => {
    event.stopPropagation();
    const { toDoValue } = this.state;
    const { id, updateToDo } = this.props;
    updateToDo(id, toDoValue);
    this.setState({
      isEditing: false
    })
  }

  _controlInput = (text) => {
    this.setState({
      toDoValue: text
    })
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 5,
    marginRight: 10
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "#F23657"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353839"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 20,
    width: width / 2
  }
})