import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'reminderskey'; // unique key to store everything
 

export async function loadReminders() {
  const rem = await AsyncStorage.getItem(KEY); 
  return rem ? JSON.parse(rem) : [];           
} 

export async function editreminder(id,text){
 const all= await loadReminders();
const edit= all.map(r=>r.id==id
  ? { ...r, text: text }
  : r);
  await saveReminders(edit) 
  return edit


}
export async function saveReminders(list) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list)); // convert list → JSON
}


export async function addReminder({text,datetime, notificationId}) {
  const reminders = await loadReminders();                // load old ones
  const newReminder = { id: Date.now().toString(), text, datetime,  notificationId,}; // make new one
  const updated = [newReminder, ...reminders];     
  
  await saveReminders(updated);                            // save updated list
  return updated;                                          // return so UI can update
}


export async function deleteReminder(id) {
  const reminders = await loadReminders();                 // load existing
  const updated = reminders.filter(r => r.id !== id);      // keep all except deleted
  await saveReminders(updated);                            // save new list
  return updated;                                          // return so UI can refresh
}
