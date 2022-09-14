// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
// import { useEffect, useState, useRef } from 'react';
// import { Camera } from 'expo-camera';
// import { shareAsync } from 'expo-sharing';
// import * as MediaLibrary from 'expo-media-library';


// export default function App() {
//   let cameraRef = useRef();
//   const [hasCameraPermission, setHasCameraPermisssion] = useState();
//   const [hasMediaLibraryPermission, setHasMediaLibraryPermisssion] = useState();
//   const [photo, setPhoto] = useState();

//   useEffect(() => {
//     (async () => {
//       const cameraPermission = await Camera.requestCameraPermissionsAsync();
//       const mediaLibrayPermission = await MediaLibrary.requestPermissionsAsync();
//       setHasCameraPermisssion(cameraPermission.status === "granted");
//       setHasMediaLibraryPermisssion(mediaLibrayPermission.status === "granted");
//     })();
//   }, []);

//   if(hasCameraPermission === undefined){
//     return <Text>Requesting Permissions  ......</Text>
//       } else if (!hasCameraPermission){
//         return <Text>Permisssion For camera Not granted Please change this</Text>
//       } 

//   let takePic = async () =>{
//     try {
//     let options ={
//       quality: 1,
//       base64: true      
//     };
//     let newPhoto = await cameraRef.current.takePictureAsync(options);
//     setPhoto(newPhoto);
//   } catch(error){
//     console.error("issue in catch",error);
//   }

//     if(photo){
//       let sharePic = () => {
//         shareAsync(photo.uri).then(() => {
//           setPhoto(undefined);
//         })

//       };

//       let savePic =() =>{
//         MediaLibrary.saveToLibraryAsync(photo.uri).then(() =>{
//           setPhoto(undefined);
//         })
//       };

//       return (
//         <SafeAreaView style={styles.container}>
//            <Image style={styles.preview} source={{ uri: "data:image/jpg:base64"+ photo.base64 }} />
//            <Button title='share' onPress={sharePic} />
//            {hasMediaLibraryPermission ? <Button title='save' onPress={savePic} /> : undefined }
//            <Button title='Discard' onPress={() => setPhoto(undefined)} />
//         </SafeAreaView>
//       );
//     }
//   }

//   return (
// <Camera style={styles.container}> = useState();
//       <View style={styles.buttonContainer}>
//          <Button title="Take   Pic" onPress={takePic} />        
//       </View>
//       <StatusBar style="auto" />
//     </Camera>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   buttonContainer: {
//     backgroundColor: '#fff',
//     alignSelf: 'flex-end',
//   },
//   preview: {
//     alignSelf: 'stretch',
//     flex: 1
//   }
// });



import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from "expo-location";

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [userLocation, setUserLocation] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  let GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;

        // alert(JSON.stringify(address));
        setUserLocation(address);
      }
    }
    return (
      <SafeAreaView style={styles.container}>
        <View>
        <Button>`${userLocation}`</Button>
        </View>
        <StatusBar style='auto' />
      </SafeAreaView>
    );
  };

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
        <Button title="Show My loc" onPress={GetCurrentLocation} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});
