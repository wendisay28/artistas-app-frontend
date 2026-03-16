// ─────────────────────────────────────────────────────────────────────────────
// InspirationTab.tsx — Tab Inspiración optimizada
// Mejoras:
// - Eliminadas categorías
// - UI más limpia
// - Upload simplificado
// - Grid Pinterest estable
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
View,
Text,
ScrollView,
StyleSheet,
TouchableOpacity,
Modal,
TextInput,
Alert,
Image,
ActivityIndicator,
Platform
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { useThemeStore } from '../../../../store/themeStore';
import { useInspirationStore, InspirationPost } from './Inspirationstore';

import { InspirationCard } from './InspirationCard';
import { InspirationDetailSheet } from './InspirationDetailSheet';

const GAP = 8;
const PADDING = 16;

export const InspirationTab: React.FC = () => {

const { isDark } = useThemeStore();

const {
posts,
removePost,
addOwnUpload
} = useInspirationStore();

const [selectedPost, setSelectedPost] = useState<InspirationPost | null>(null);

const [uploadVisible, setUploadVisible] = useState(false);
const [uploadImage, setUploadImage] = useState<string | null>(null);
const [uploadTitle, setUploadTitle] = useState('');
const [uploading, setUploading] = useState(false);


// ─────────────────────────────────────────
// IMAGE PICKER
// ─────────────────────────────────────────

const openImagePicker = async () => {

if (Platform.OS !== 'web') {

const { status } =
await ImagePicker.requestMediaLibraryPermissionsAsync();

if (status !== 'granted') {

Alert.alert(
'Permiso requerido',
'Necesitamos acceso a tu galería.'
);

return;

}

}

const result = await ImagePicker.launchImageLibraryAsync({

mediaTypes: ['images'] as any,
allowsEditing: true,
aspect: [3, 4],
quality: 0.85,

});

if (!result.canceled && result.assets[0]) {

setUploadImage(result.assets[0].uri);

}

};


// ─────────────────────────────────────────
// UPLOAD CONFIRM
// ─────────────────────────────────────────

const handleUploadConfirm = () => {

if (!uploadImage) {

Alert.alert(
'Falta imagen',
'Selecciona una foto primero.'
);

return;

}

if (!uploadTitle.trim()) {

Alert.alert(
'Falta título',
'Escribe un título.'
);

return;

}

setUploading(true);

addOwnUpload({

image: uploadImage,
title: uploadTitle.trim(),
category: 'arte',
tags: []

});

setUploading(false);

setUploadVisible(false);

setUploadImage(null);
setUploadTitle('');

};


// ─────────────────────────────────────────
// PINTEREST GRID
// ─────────────────────────────────────────

const { left, right } = useMemo(() => {

const left: InspirationPost[] = [];
const right: InspirationPost[] = [];

posts.forEach((post, i) => {

i % 2 === 0
? left.push(post)
: right.push(post);

});

return { left, right };

}, [posts]);


// ─────────────────────────────────────────
// RENDER CARD
// ─────────────────────────────────────────

const renderPost = (post: InspirationPost) => (

<InspirationCard
key={post.id}
post={post}
onPress={() => setSelectedPost(post)}
onBookmarkToggle={() => removePost(post.id)}
/>

);


// ─────────────────────────────────────────
// UI
// ─────────────────────────────────────────

return (

<View style={[styles.root, isDark && styles.rootDark]}>

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={{ paddingBottom: 40 }}
>

{/* HEADER */}

<View style={styles.header}>

<View>

<Text style={[styles.title, isDark && styles.titleDark]}>
Inspiración
</Text>

<Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
{posts.length} referencias
</Text>

</View>

<TouchableOpacity
onPress={() => setUploadVisible(true)}
activeOpacity={0.85}
>

<LinearGradient
colors={['#7c3aed', '#2563eb']}
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 0 }}
style={styles.uploadBtn}
>

<Ionicons name="add" size={18} color="#fff" />

<Text style={styles.uploadText}>
Subir
</Text>

</LinearGradient>

</TouchableOpacity>

</View>


{/* EMPTY STATE */}

{posts.length === 0 ? (

<View style={styles.empty}>

<Ionicons
name="images-outline"
size={42}
color={isDark ? '#a78bfa' : '#7c3aed'}
/>

<Text style={[styles.emptyTitle, isDark && styles.titleDark]}>
Aún no tienes inspiración
</Text>

<Text style={styles.emptyText}>
Guarda referencias o sube tus propias ideas
</Text>

</View>

) : (

<View style={styles.grid}>

<View style={styles.column}>
{left.map(renderPost)}
</View>

<View style={styles.column}>
{right.map(renderPost)}
</View>

</View>

)}

</ScrollView>


{/* MODAL UPLOAD */}

<Modal
visible={uploadVisible}
transparent
animationType="slide"
>

<View style={styles.modalBackdrop}>

<View style={[styles.modal, isDark && styles.modalDark]}>

<Text style={[styles.modalTitle, isDark && styles.titleDark]}>
Subir referencia
</Text>


{/* IMAGE PICKER */}

<TouchableOpacity
style={styles.imagePicker}
onPress={openImagePicker}
>

{uploadImage ? (

<Image
source={{ uri: uploadImage }}
style={styles.imagePreview}
/>

) : (

<View style={styles.imagePlaceholder}>

<Ionicons
name="image-outline"
size={32}
color="#7c3aed"
/>

<Text style={styles.pickText}>
Elegir foto
</Text>

</View>

)}

</TouchableOpacity>


{/* TITLE */}

<TextInput
style={[styles.input, isDark && styles.inputDark]}
placeholder="Título"
placeholderTextColor="#888"
value={uploadTitle}
onChangeText={setUploadTitle}
/>


{/* SAVE */}

<TouchableOpacity
onPress={handleUploadConfirm}
disabled={uploading}
>

{isDark ? (
<View style={[styles.saveBtn, styles.saveBtnDark]}>
{uploading
? <ActivityIndicator color="#fff"/>
: <Text style={styles.saveText}>
Guardar referencia
</Text>
}
</View>
) : (
<LinearGradient
colors={['#7c3aed', '#2563eb']}
style={styles.saveBtn}
>
{uploading
? <ActivityIndicator color="#fff"/>
: <Text style={styles.saveText}>
Guardar referencia
</Text>
}
</LinearGradient>
)}

</TouchableOpacity>


{/* CLOSE */}

<TouchableOpacity
onPress={() => setUploadVisible(false)}
style={styles.closeBtn}
>

<Text style={styles.closeText}>
Cancelar
</Text>

</TouchableOpacity>

</View>

</View>

</Modal>


{/* DETAIL SHEET */}

<InspirationDetailSheet
post={selectedPost}
visible={selectedPost !== null}
onClose={() => setSelectedPost(null)}
/>

</View>

);

};


// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────

const styles = StyleSheet.create({

root: {
flex: 1,
backgroundColor: '#faf9ff'
},

rootDark: {
backgroundColor: '#0a0618'
},

header: {
padding: PADDING,
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center'
},

title: {
fontSize: 20,
fontWeight: '700',
color: '#1e1b4b'
},

titleDark: {
color: '#f5f3ff'
},

subtitle: {
fontSize: 13,
color: '#7c3aed'
},

subtitleDark: {
color: '#a78bfa'
},

uploadBtn: {
flexDirection: 'row',
alignItems: 'center',
gap: 6,
paddingHorizontal: 14,
paddingVertical: 8,
borderRadius: 40
},

uploadText: {
color: '#fff',
fontWeight: '700'
},

grid: {
flexDirection: 'row',
gap: GAP,
paddingHorizontal: PADDING
},

column: {
flex: 1
},

empty: {
alignItems: 'center',
marginTop: 80,
gap: 12
},

emptyTitle: {
fontSize: 16,
fontWeight: '700'
},

emptyText: {
fontSize: 13,
opacity: 0.6
},

modalBackdrop: {
flex: 1,
justifyContent: 'flex-end',
backgroundColor: 'rgba(0,0,0,0.5)'
},

modal: {
backgroundColor: '#fff',
padding: 20,
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
gap: 14
},

modalDark: {
backgroundColor: '#0a0618'
},

modalTitle: {
fontSize: 18,
fontWeight: '700'
},

imagePicker: {
height: 180,
borderRadius: 14,
overflow: 'hidden',
borderWidth: 1,
borderColor: '#7c3aed'
},

imagePreview: {
width: '100%',
height: '100%'
},

imagePlaceholder: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
gap: 6
},

pickText: {
fontSize: 13,
color: '#7c3aed'
},

input: {
borderWidth: 1,
borderColor: '#ddd',
borderRadius: 10,
padding: 12
},

inputDark: {
borderColor: '#444',
color: '#fff'
},

saveBtn: {
padding: 14,
borderRadius: 12,
alignItems: 'center'
},

saveBtnDark: {
backgroundColor: 'rgba(255,255,255,0.10)',
borderWidth: 1,
borderColor: 'rgba(255,255,255,0.28)',
},

saveText: {
color: '#fff',
fontWeight: '700'
},

closeBtn: {
alignItems: 'center',
marginTop: 6
},

closeText: {
color: '#888'
}

});