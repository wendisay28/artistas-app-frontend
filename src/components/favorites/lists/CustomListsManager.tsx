import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Platform,
  Alert
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Types (Asegúrate de importar tu interfaz CustomList)
interface CustomListsManagerProps {
  lists: any[];
  selectedListId: string | null;
  onCreateList: (name: string) => void;
  onRenameList: (id: string, newName: string) => void;
  onDeleteList: (id: string) => void;
  onSelectList: (id: string | null) => void;
}

export function CustomListsManager({
  lists,
  selectedListId,
  onCreateList,
  onRenameList,
  onDeleteList,
  onSelectList,
}: CustomListsManagerProps) {
  const [showSelector, setShowSelector] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'rename'>('create');
  const [inputValue, setInputValue] = useState('');
  const [targetId, setTargetId] = useState('');

  const selectedList = lists.find(l => l.id === selectedListId);

  // Handlers
  const handleOpenCreate = () => {
    setModalMode('create');
    setInputValue('');
    setModalVisible(true);
    setShowSelector(false);
  };

  const handleOpenRename = (list: any) => {
    setModalMode('rename');
    setTargetId(list.id);
    setInputValue(list.name);
    setModalVisible(true);
    setShowSelector(false);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    if (modalMode === 'create') {
      onCreateList(inputValue.trim());
    } else {
      onRenameList(targetId, inputValue.trim());
    }
    setModalVisible(false);
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Eliminar lista",
      "¿Estás seguro de que deseas eliminar esta lista?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => onDeleteList(id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Botón Principal Selector */}
      <TouchableOpacity 
        style={styles.mainBtn} 
        onPress={() => setShowSelector(true)}
      >
        <Feather name="folder" size={16} color="#9333ea" style={styles.icon} />
        <Text style={styles.mainBtnText}>
          {selectedListId ? selectedList?.name : "Todas mis listas"}
        </Text>
        <Feather name="chevron-down" size={14} color="#6b7280" />
      </TouchableOpacity>

      {/* Botón Nueva Lista */}
      <TouchableOpacity onPress={handleOpenCreate}>
        <LinearGradient
          colors={['#9333ea', '#2563eb']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.newBtn}
        >
          <Feather name="plus" size={18} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal Selector de Listas */}
      <Modal visible={showSelector} animationType="fade" transparent>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowSelector(false)}
        >
          <View style={styles.selectorContent}>
            <Text style={styles.modalTitle}>Mis Listas</Text>
            
            <TouchableOpacity 
              style={[styles.listItem, !selectedListId && styles.listItemSelected]}
              onPress={() => { onSelectList(null); setShowSelector(false); }}
            >
              <Feather name="layers" size={18} color={!selectedListId ? "#7e22ce" : "#6b7280"} />
              <Text style={[styles.listItemText, !selectedListId && styles.listItemTextSelected]}>
                Todos los favoritos
              </Text>
            </TouchableOpacity>

            <FlatList
              data={lists}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => (
                <View style={[styles.listItem, selectedListId === item.id && styles.listItemSelected]}>
                  <TouchableOpacity 
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => { onSelectList(item.id); setShowSelector(false); }}
                  >
                    <Feather name="folder" size={18} color="#9333ea" />
                    <Text style={[styles.listItemText, selectedListId === item.id && styles.listItemTextSelected]}>
                      {item.name} <Text style={styles.countText}>({item.itemIds.length})</Text>
                    </Text>
                  </TouchableOpacity>
                  
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => handleOpenRename(item)} style={styles.actionBtn}>
                      <Feather name="edit-2" size={14} color="#2563eb" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.actionBtn}>
                      <Feather name="trash-2" size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Crear/Renombrar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.inputModalContainer}>
            <Text style={styles.inputModalTitle}>
              {modalMode === 'create' ? 'Crear Nueva Lista' : 'Renombrar Lista'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Mis artistas favoritos..."
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleSubmit}>
                <LinearGradient
                  colors={['#9333ea', '#2563eb']}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitBtnText}>
                    {modalMode === 'create' ? 'Crear' : 'Guardar'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  mainBtnText: {
    fontSize: 14,
    color: '#1f2937',
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  newBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#9333ea',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  selectorContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4c1d95',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  listItemSelected: {
    backgroundColor: '#f5f3ff',
  },
  listItemText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  listItemTextSelected: {
    color: '#7e22ce',
    fontWeight: '600',
  },
  countText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  inputModalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  inputModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});