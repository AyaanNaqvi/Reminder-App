import { View, Text, Pressable, StyleSheet,TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { addReminder, editreminder } from '../src/storage/reminder';
import { useLocalSearchParams } from "expo-router";
import { loadReminders, saveReminders } from "../src/storage/reminder";




export default function Editreminder() {
  const router = useRouter(); 
   const [reminder, changerem] = useState('');
   const { id } = useLocalSearchParams();

const handleSave= async()=>{
    console.log('Saved reminder:', reminder);
    await editreminder(id,reminder);
    changerem('');


  };
useEffect(()=>{
  async function load(){

    const all=await loadReminders();
const toedit= all.find(r=>r.id==id)
if (toedit) changerem(toedit.text);
  }
load();

}, [])





  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Rename </Text>
      <TextInput style={styles.input}
      placeholder= "type the new name "
      placeholderTextColor="#999"
      value= {reminder}
      onChangeText= {changerem}
/>

     

      <Pressable style={styles.btn} onPress={async ()=>{
        await handleSave()
        router.back()
      }}>
<Text style={styles.btnText}>save </Text> 
      </Pressable>


    
      
      <Pressable style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Go Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24,color:'white', fontWeight: 'bold', marginBottom: 20 },
  btn: { backgroundColor: '#444', padding: 15, borderRadius: 8 },
  btnText: { color: 'white', fontWeight: '600' },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  });
