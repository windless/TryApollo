/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider, graphql } from 'react-apollo'
import gql from 'graphql-tag'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({uri: 'http://localhost:4000/graphql'})
})

const TrainerQuery = gql`
  query TrainerQuery($id: ID!) {
    message: getMessage(id: $id) {
      id
      content
      author
    }
  }
`

class Pokedex extends Component {
  render() {
    if (this.props.data.error) {
      return <Text>An unexpected error occurred {this.props.data.error.toString()}</Text>
    }

    if (this.props.data.loading || !this.props.data.message) {
      return <Text>Loading</Text>
    }

    return (
      <Text>
        Hey {this.props.data.message.author}!
      </Text>
    )
  }
}
const PokedexWithData = graphql(TrainerQuery, {
  options: {
    variables: {
      id: '1'
    }
  }
})(Pokedex)

class AddMessage extends Component {
  render() {
    return (
      <Button
        title='Add Message'
        onPress={async () => {
          const result = await this.props.mutate({variables: {content: '123', author: 'windless'}})
          console.log(result)
        }}
      />
    )
  }
}

const MessageMutation = gql`
  mutation createMessage($content: String!, $author: String!) {
    message: createMessage(input: {content: $content, author: $author}) {
      id
      content
      author
    }
  }
`

const AddMessageWithMutation = graphql(MessageMutation)(AddMessage)

export default class TryApollo extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <PokedexWithData />
          <AddMessageWithMutation />
        </View>
      </ApolloProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

AppRegistry.registerComponent('TryApollo', () => TryApollo)
