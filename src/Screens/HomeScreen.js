import {useNetInfo} from '@react-native-community/netinfo';
import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';

export default function HomeScreen() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [refreshCount, setRefreshCount] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [latitude, setLatitude] = useState(0);
  const [Longitude, setLongitude] = useState(0);
  const requestLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Corrected typo here
        {
          title: 'Cool Photo App Location Permission',
          message:
            'Cool Photo App needs access to your location ' +
            'so you can use awesome location features.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const netInfo = useNetInfo();

  const getdeviceInfo = async () => {
    const batteryLevel = await DeviceInfo.getBatteryLevel();

    // Function to update charging status

    const charging = await DeviceInfo.isBatteryCharging();

    setDeviceInfo({...deviceInfo, batteryLevel, charging});
  };

  const getData = () => {
    getdeviceInfo();
    requestLocation();
    getLocation();
  };

  useEffect(() => {
    if (netInfo.isConnected) {
      getData();
    } else {
      Alert.alert('No internet', 'Please check your internet connection');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netInfo.isConnected]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const refreshInterval = 15 * 60 * 1000;
    setTimeout(() => {
      setRefreshCount(prevState => prevState + 1);
    }, refreshInterval);
  }, [refreshCount]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const RowTexted = ({title, value}) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailText}>{title}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Text style={styles.title}>
        SECQUR <Text style={styles.subTitle}>AI</Text> SE
      </Text>
      <View style={styles.timeContainer}>
        <Text style={styles.dateTimeText}>
          {currentDateTime.toLocaleString()}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <RowTexted title="Capture Count" value={refreshCount} />
        <RowTexted
          title="Connectivity"
          value={netInfo.isConnected ? 'ON' : 'OFF'}
        />
        <RowTexted
          title="BAttery Charging"
          value={deviceInfo?.charging ? 'ON' : 'OFF'}
        />
        <RowTexted
          title="Battery Charge"
          value={`${(deviceInfo?.batteryLevel * 100).toFixed(0)}%`}
        />
        <RowTexted
          title="Location"
          value={`Lati:${latitude} Long:${Longitude}`}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonCont}
        onPress={() => setRefreshCount(prevCount => prevCount + 1)}>
        <Text style={styles.buttonTxt}>Manual Data Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
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
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#fbfbfb',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailText: {
    color: '#fbfbfb',
    fontSize: 20,
  },
  detailValue: {
    fontSize: 15,
    color: '#0ADA2C',
  },
  buttonCont: {
    marginTop: 20,
    height: 40,
    backgroundColor: '#004C99',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonTxt: {
    color: '#FBFBFB',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
