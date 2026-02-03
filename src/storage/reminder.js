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
  await AsyncStorage.setItem(KEY, JSON.stringify(list)); 
}


export async function addReminder({text,datetime, notificationId}) {
  const reminders = await loadReminders();                
  const newReminder = { id: Date.now().toString(), text, datetime,  notificationId,}; 
  const updated = [newReminder, ...reminders];     
  
  await saveReminders(updated);                            
  return updated;                                         


export async function deleteReminder(id) {
  const reminders = await loadReminders();                
  const updated = reminders.filter(r => r.id !== id);     
  await saveReminders(updated);                            
  return updated;                                          
}
