import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React, {useEffect} from 'react';

export default function WelcomeScreen({navigation}) {
  useEffect(() => {
    setTimeout(() => navigation.navigate('Home'), 2500);
  });
  return (
    <View style={styles.Conatainer}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <Text style={styles.title}>
        SECQUR <Text style={styles.subTitle}>AI</Text> SE
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  Conatainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2B2397',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
  },
});
