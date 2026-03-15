// ─────────────────────────────────────────────────────────────
// InspirationDetailSheet.tsx
// Vista completa de inspiración optimizada
// Imagen protagonista + perfil + agregar a proyecto
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
Modal,
View,
Text,
TouchableOpacity,
StyleSheet,
ScrollView,
Alert,
Platform
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useThemeStore } from '../../../../store/themeStore';
import { useInspirationStore, InspirationPost } from './Inspirationstore';
import { useListsStore } from '../../../../store/listsStore';

type Props = {
post: InspirationPost | null
visible: boolean
onClose: () => void
onViewArtist?: (artistId: string) => void
}

export const InspirationDetailSheet: React.FC<Props> = ({
post,
visible,
onClose,
onViewArtist
}) => {

const insets = useSafeAreaInsets()

const { isDark } = useThemeStore()

const { removePost, addToProjectId } = useInspirationStore()

const { projects, addInspirationToProject, createProject } = useListsStore()

const [selectedProject, setSelectedProject] = useState<string | null>(null)

if (!post) return null


const haptic = () => {
if (Platform.OS !== 'web') {
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}
}


const handleRemove = () => {

haptic()

removePost(post.id)

onClose()

}


const handleSelectProject = (id: string) => {

haptic()

setSelectedProject(prev =>
prev === id ? null : id
)

}


const handleSave = () => {

if (!selectedProject) {

Alert.alert(
'Selecciona un proyecto',
'Elige un proyecto donde guardar esta inspiración.'
)

return

}

addInspirationToProject(selectedProject, post.id)

addToProjectId(post.id, selectedProject)

Alert.alert(
'Guardado',
'Inspiración agregada al proyecto.'
)

onClose()

}


const handleCreateProject = () => {

Alert.prompt(
'Nuevo proyecto',
'Nombre del proyecto',
(name) => {

if (!name) return

createProject(name, 'folder-outline')

}

)

}


const handleViewArtist = () => {

if (onViewArtist && post.artistId) {

onViewArtist(post.artistId)

}

}


// ─────────────────────────────────────────

return (

<Modal
visible={visible}
animationType="slide"
statusBarTranslucent
onRequestClose={onClose}
>

<View style={[styles.root, isDark && styles.rootDark]}>

{/* IMAGEN HERO */}

<View style={styles.hero}>

<Image
source={{ uri: post.image }}
style={StyleSheet.absoluteFill}
contentFit="cover"
/>

<LinearGradient
colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)']}
style={styles.fade}
/>


<TouchableOpacity
style={[styles.closeBtn, { top: insets.top + 8 }]}
onPress={onClose}
>

<Ionicons
name="chevron-down"
size={20}
color="#fff"
/>

</TouchableOpacity>


<TouchableOpacity
style={[styles.removeBtn, { top: insets.top + 8 }]}
onPress={handleRemove}
>

<Ionicons
name="bookmark"
size={18}
color="#fff"
/>

</TouchableOpacity>

</View>


{/* CONTENIDO */}

<ScrollView
contentContainerStyle={{
padding: 20,
paddingBottom: insets.bottom + 40
}}
showsVerticalScrollIndicator={false}
>


{/* AUTOR */}

<TouchableOpacity
style={styles.authorRow}
onPress={handleViewArtist}
activeOpacity={0.7}
>

<View style={styles.avatar}>

<Text style={styles.avatarText}>
{post.author?.[0]?.toUpperCase() ?? 'A'}
</Text>

</View>

<View>

<Text style={[styles.authorName, isDark && styles.textDark]}>
{post.author}
</Text>

{post.artistId && (

<Text style={styles.authorSub}>
Ver perfil →
</Text>

)}

</View>

</TouchableOpacity>


{/* TITULO SOLO SI EXISTE */}

{post.title ? (

<Text style={[styles.title, isDark && styles.textDark]}>
{post.title}
</Text>

) : null}


{/* DESCRIPCION SOLO SI EXISTE */}

{post.description ? (

<Text style={[styles.description, isDark && styles.descDark]}>
{post.description}
</Text>

) : null}


{/* DIVIDER */}

<View style={styles.divider} />


{/* PROYECTOS */}

<Text style={[styles.sectionTitle, isDark && styles.textDark]}>
Agregar a proyecto
</Text>


{projects.length === 0 ? (

<View style={styles.noProjects}>

<Text style={styles.noProjectsText}>
Aún no tienes proyectos
</Text>

<TouchableOpacity
onPress={handleCreateProject}
style={styles.createProjectBtn}
>

<Text style={styles.createProjectText}>
Crear proyecto
</Text>

</TouchableOpacity>

</View>

) : (

<ScrollView
horizontal
showsHorizontalScrollIndicator={false}
contentContainerStyle={styles.projectRow}
>

{projects.map(p => {

const isSelected = selectedProject === p.id

return (

<TouchableOpacity
key={p.id}
onPress={() => handleSelectProject(p.id)}
style={[
styles.projectChip,
isSelected && styles.projectChipSelected
]}
>

<Text
style={[
styles.projectChipText,
isSelected && styles.projectChipTextSelected
]}
>

{p.name}

</Text>

</TouchableOpacity>

)

})}

</ScrollView>

)}


{/* BOTON GUARDAR */}

<TouchableOpacity
onPress={handleSave}
disabled={!selectedProject}
>

<LinearGradient
colors={
selectedProject
? ['#7c3aed', '#2563eb']
: ['#d1d5db', '#d1d5db']
}
style={styles.saveBtn}
>

<Text style={styles.saveText}>
{selectedProject
? 'Guardar en proyecto'
: 'Selecciona proyecto'}
</Text>

</LinearGradient>

</TouchableOpacity>


</ScrollView>

</View>

</Modal>

)

}


// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────

const styles = StyleSheet.create({

root:{
flex:1,
backgroundColor:'#faf9ff'
},

rootDark:{
backgroundColor:'#0a0618'
},

hero:{
height:'50%',
position:'relative'
},

fade:{
position:'absolute',
bottom:0,
left:0,
right:0,
height:'50%'
},

closeBtn:{
position:'absolute',
left:16,
width:36,
height:36,
borderRadius:18,
backgroundColor:'rgba(0,0,0,0.5)',
alignItems:'center',
justifyContent:'center'
},

removeBtn:{
position:'absolute',
right:16,
width:36,
height:36,
borderRadius:18,
backgroundColor:'rgba(0,0,0,0.5)',
alignItems:'center',
justifyContent:'center'
},

authorRow:{
flexDirection:'row',
alignItems:'center',
gap:10,
marginBottom:14
},

avatar:{
width:40,
height:40,
borderRadius:20,
backgroundColor:'#7c3aed',
alignItems:'center',
justifyContent:'center'
},

avatarText:{
color:'#fff',
fontWeight:'700'
},

authorName:{
fontSize:15,
fontWeight:'700',
color:'#1e1b4b'
},

authorSub:{
fontSize:12,
color:'#7c3aed'
},

title:{
fontSize:22,
fontWeight:'800',
marginBottom:8,
color:'#1e1b4b'
},

description:{
fontSize:15,
lineHeight:22,
marginBottom:20,
color:'#4b5563'
},

descDark:{
color:'#9ca3af'
},

divider:{
height:1,
backgroundColor:'#e5e7eb',
marginBottom:16
},

sectionTitle:{
fontSize:14,
fontWeight:'700',
marginBottom:12,
color:'#1e1b4b'
},

projectRow:{
gap:8,
marginBottom:20
},

projectChip:{
paddingHorizontal:14,
paddingVertical:8,
borderRadius:10,
backgroundColor:'#ede9fe'
},

projectChipSelected:{
backgroundColor:'#7c3aed'
},

projectChipText:{
color:'#7c3aed',
fontWeight:'600'
},

projectChipTextSelected:{
color:'#fff'
},

saveBtn:{
paddingVertical:14,
borderRadius:12,
alignItems:'center'
},

saveText:{
color:'#fff',
fontWeight:'700'
},

noProjects:{
alignItems:'center',
gap:10,
marginBottom:20
},

noProjectsText:{
color:'#9ca3af'
},

createProjectBtn:{
paddingHorizontal:16,
paddingVertical:8,
borderRadius:10,
backgroundColor:'#7c3aed'
},

createProjectText:{
color:'#fff',
fontWeight:'600'
},

textDark:{
color:'#f5f3ff'
}

})