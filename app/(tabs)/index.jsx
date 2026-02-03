import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ImageBackground, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import prr from '../../assets/images/prr.png';
import { deleteReminder, loadReminders, addReminder } from '../../src/storage/reminder';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

  import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


export default function Index() {
  const router = useRouter();

  const [datepickermodal, datepickermodalvis] = useState(false);
  const [date, setdate] = useState(null);
  const [storedReminders, setStoredReminders] = useState([]);
  const [visible, setvisible] = useState(false);
  const [text, settext] = useState("");
  const [dotsvisible,setdotsvisible]= useState(false);
  const[Id,selectedId]= useState(null);



  useFocusEffect(
    useCallback(() => {
      async function list() {
        const data = await loadReminders();
        setStoredReminders(data);
      }
      list();
      return ()=> {};
    }, [])
  );

  useEffect(()=>{
    async function setup() {
      const {status}= await Notifications.requestPermissionsAsync()
      console.log('permission',status)
    
    if (Platform.OS== 'android'){
     await Notifications.setNotificationChannelAsync('notif', {
  name: 'notif',
  importance: Notifications.AndroidImportance.MAX,
});

      
    }
  }


setup();

  }, []);
  
  const handleSave = async (selectedDate) => {

const notificationId = await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Reminder',
    body: text,
  },
  trigger:{

  date: new Date(selectedDate),
  type: Notifications.SchedulableTriggerInputTypes.DATE
  },
});

    console.log('Saved reminder:', text);
    const updated = await addReminder({text,
      datetime:selectedDate.toISOString(),
    notificationId,})

    setStoredReminders(updated);
    settext("");
    setvisible(false);

    
  };

  return (
    <View style={styles.container}>
     <ImageBackground
  source={prr}
  resizeMode="cover"
  style={styles.image}
>

        <Text style={styles.title}>Home</Text>

       
        <Pressable onPress={() => setvisible(true)} style={styles.addbutton}>
     <Text style={styles.addButtonText}>+</Text>
        </Pressable>
 
      <FlatList
  data={storedReminders}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.remindersbox}>

      <View>
        <Text style={styles.remindernames}>{item.text}</Text>
        <Text style={styles.remindertime}>
          {new Date(item.datetime).toLocaleString()}
        </Text>
      </View>

      <Pressable
        style={styles.threedots}
        onPress={() => {
          selectedId(item.id);
          setdotsvisible(true);
        }}
      >
        <Text>
          :
          :
        </Text>
      </Pressable>

    </View>
  )}
/>
   
                                                   
        

        
        <Modal
          visible={visible}
          transparent={true}
          onRequestClose={() => setvisible(false)}
        >
          <View style={styles.modalcontainer}>
            <View style={styles.modalbox}>
              <Text style={styles.title}>new reminder</Text>

              <TextInput
                placeholder="enter the reminder"
                value={text}
                onChangeText={settext}
                style={styles.addButtonText}
              />

            
                <Pressable
                style={styles.datetime}
                onPress={() =>{
                  setvisible(false);
                  setTimeout(() => {
                      datepickermodalvis(true)
                  }, 300);
        
                
            
                }}
              >
                <Text style={styles.datetimetext}> date/time</Text>
                  </Pressable>
save
            </View>


               </View>
        </Modal>

        
        <DateTimePickerModal
          isVisible={datepickermodal}
          mode="datetime"
          onConfirm={async (selectedDate) => {
            
            await handleSave(selectedDate);
            datepickermodalvis(false);

          }}
          onCancel={() => datepickermodalvis(false)}
        />

        
        <Pressable style={styles.button} onPress={() => router.push('/editreminder')}>
          <Text style={styles.textinbutton}>Add Reminder</Text>
        </Pressable>

        <Text style={{ color: 'white', marginTop: 16 }}>
          Saved: {storedReminders.length}
        </Text>

<Modal 
visible={dotsvisible}
transparent= {true}
onRequestClose={()=> setdotsvisible(false)}
>
  <View style={styles.modalcontainer}>
<View style={styles.modalbox}>
  <Pressable   style={styles.deleteButtonmodal}   onPress={async ()=>{

   const afterdelete= await deleteReminder(Id)
   setStoredReminders(afterdelete)
   setdotsvisible(false)
   
  }

  }>
    delete 


  </Pressable>
  <Pressable style= {styles.editButtonmodal} onPress={() => {
    router.push({
      pathname: '/editreminder',
      params: {id : Id}
    });
    setdotsvisible(false)
    
    
    }}>
  
edit 

  </Pressable>

  


</View>
param
</View>
</Modal>



      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
  title: {
    color: 'white',
    fontSize: 27, fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.23)',width: '100%',
    paddingVertical: 10,
    alignSelf: 'stretch', justifyContent: 'flex-start',
    paddingTop: 20,
    borderRadius: 10,
    textAlignVertical: 'center',
    position: 'relative',
    top: 1, 
  },
  modalcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    
  },
  modalbox: {
    backgroundColor: 'gray',
    width: '80%',
    padding: 15,
    position: 'relative',
    top: 200,
    left: 50,
    height: 400,
    borderRadius: 15,
    shadowColor: '#000',shadowOffset: { width: 0, height: 5 },shadowRadius: 7,
    shadowOpacity: 0.5,
  },
  remindernames: {
    fontSize: 25,color: 'blue',
    fontWeight: 'light',
    textAlign: 'center',
    position: 'relative',
    right: 55,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  remindersbox: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 70,
  },
  deleteButton: {
 
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletetext: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addbutton: {
    position: 'absolute',
    bottom: 10,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    height: 50,
    width: 50,
    right: 20,
    bottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 29,
    fontWeight: 'condensedBold',
    marginBottom: 10,
    position: 'relative',
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 8,
  },
  datetime: {
    position: 'absolute',
    bottom: 80,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    height: 50,
    width: 150,
    right: 100,
  },
  datetimetext: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 8,
  },
  saveButton: {
    position: 'absolute',
    bottom: 4,
    left: 23,
    backgroundColor: 'rgba(65, 64, 64, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 8,
    marginLeft: 235,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonmodal: {
    position: 'absolute',
    top: 30,
    right: 220,
   
    backgroundColor: 'rgba(65, 64, 64, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 8,
    marginLeft: 235,
    justifyContent: 'center',
    alignItems: 'center',
  },
    editButtonmodal: {
    position: 'absolute',
    top: 200,
    right: 220,
   
    backgroundColor: 'rgba(65, 64, 64, 0.7)',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 8,
    marginLeft: 235,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



