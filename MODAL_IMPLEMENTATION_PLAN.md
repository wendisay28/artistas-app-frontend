# Plan de Implementación - Modales Globales con Zustand

## 🎯 Objetivo
Mover todos los modales fuera del NavigationContainer para resolver problemas de KeyboardAvoidingView y scroll, manteniendo el rendimiento óptimo con `react-native-screens` activado.

## 📋 Fase 1: Infraestructura Base (Prioridad Alta)

### 1. Crear Store Centralizado de Modales
**Archivo:** `src/store/modalStore.ts`

```typescript
import { create } from 'zustand';

interface ModalState {
  // Estados de modales existentes
  bioModal: { 
    visible: boolean; 
    initialValue: string;
  };
  
  experienceModal: { 
    visible: boolean; 
    data: any;
  };
  
  editServiceModal: { 
    visible: boolean; 
    service: any;
  };
  
  // Actions
  openBioModal: (initialValue: string) => void;
  closeBioModal: () => void;
  
  openExperienceModal: (data: any) => void;
  closeExperienceModal: () => void;
  
  openEditServiceModal: (service: any) => void;
  closeEditServiceModal: () => void;
  
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // Estados iniciales
  bioModal: { visible: false, initialValue: '' },
  experienceModal: { visible: false, data: null },
  editServiceModal: { visible: false, service: null },
  
  // Actions
  openBioModal: (initialValue) => set((state) => ({
    bioModal: { visible: true, initialValue }
  })),
  
  closeBioModal: () => set((state) => ({
    bioModal: { visible: false, initialValue: '' }
  })),
  
  openExperienceModal: (data) => set((state) => ({
    experienceModal: { visible: true, data }
  })),
  
  closeExperienceModal: () => set((state) => ({
    experienceModal: { visible: false, data: null }
  })),
  
  openEditServiceModal: (service) => set((state) => ({
    editServiceModal: { visible: true, service }
  })),
  
  closeEditServiceModal: () => set((state) => ({
    editServiceModal: { visible: false, service: null }
  })),
  
  closeAllModals: () => set({
    bioModal: { visible: false, initialValue: '' },
    experienceModal: { visible: false, data: null },
    editServiceModal: { visible: false, service: null },
  }),
}));
```

### 2. Crear ModalContainer Global
**Archivo:** `src/components/ModalContainer.tsx`

```typescript
import React from 'react';
import { useModalStore } from '../store/modalStore';
import { BioModal } from '../screens/profile/components/modals/BioModal';
import { ExperienceModal } from '../screens/profile/components/modals/ExperienceModal';
import { EditServiceModal } from '../screens/profile/components/modals/EditServiceModal';

export const ModalContainer = () => {
  const {
    bioModal,
    experienceModal,
    editServiceModal,
    closeBioModal,
    closeExperienceModal,
    closeEditServiceModal,
  } = useModalStore();

  return (
    <>
      {/* Bio Modal */}
      <BioModal
        visible={bioModal.visible}
        initialValue={bioModal.initialValue}
        onClose={closeBioModal}
        onSave={(value) => {
          // Aquí iría la lógica de guardar bio
          console.log('Saving bio:', value);
          closeBioModal();
        }}
      />
      
      {/* Experience Modal */}
      <ExperienceModal
        visible={experienceModal.visible}
        data={experienceModal.data}
        onClose={closeExperienceModal}
        onSave={(data) => {
          // Aquí iría la lógica de guardar experiencia
          console.log('Saving experience:', data);
          closeExperienceModal();
        }}
      />
      
      {/* Edit Service Modal */}
      <EditServiceModal
        visible={editServiceModal.visible}
        service={editServiceModal.service}
        onClose={closeEditServiceModal}
        onSave={(data) => {
          // Aquí iría la lógica de guardar servicio
          console.log('Saving service:', data);
          closeEditServiceModal();
        }}
      />
    </>
  );
};
```

### 3. Integrar ModalContainer en AppNavigator
**Archivo:** `src/navigation/AppNavigator.tsx`

```typescript
// ... imports existentes
import { ModalContainer } from '../components/ModalContainer';

export const AppNavigator = () => {
  // ... lógica existente

  return (
    <>
      <NavigationContainer linking={linking}>
        {!isAuthenticated && <AuthStack />}
        {showSetupProfile && <OnboardingScreen />}
        {isAuthenticated && (isProfileComplete || user?.role === 'client') && !showSetupProfile && (
          <MainTabNavigator />
        )}
      </NavigationContainer>
      
      {/* ModalContainer fuera del NavigationContainer */}
      <ModalContainer />
    </>
  );
};
```

## 📋 Fase 2: Migración de Modales (Prioridad Media)

### 4. Actualizar BioModal
**Archivo:** `src/screens/profile/components/modals/BioModal.tsx`
- Remover estado local (`useState`)
- Recibir todas las props desde el store
- Mantener la lógica del componente intacta

### 5. Actualizar ExperienceModal
**Archivo:** `src/screens/profile/components/modals/ExperienceModal.tsx`
- Migrar estado local al store
- Conectar handlers con el store

### 6. Actualizar EditServiceModal
**Archivo:** `src/screens/profile/components/modals/EditServiceModal.tsx`
- Migrar estado complejo al store
- Mantener toda la lógica de formularios

## 📋 Fase 3: Actualización de Screens (Prioridad Media)

### 7. Actualizar ProfileScreen
**Archivo:** `src/screens/profile/index.tsx`

```typescript
import { useModalStore } from '../../store/modalStore';

export const ProfileScreen = () => {
  const { openBioModal, openExperienceModal, openEditServiceModal } = useModalStore();
  
  // Remover estados locales de modales
  
  const handleEditSobreMi = useCallback(() => {
    openBioModal(artistData.description || '');
  }, [artistData.description]);
  
  // ... otros handlers
};
```

## 📋 Fase 4: Testing y Validación (Prioridad Alta)

### 8. Pruebas Integrales

#### Checklist de Validación:
- [ ] BioModal abre correctamente desde ProfileScreen
- [ ] Teclado funciona correctamente en BioModal
- [ ] Scroll funciona correctamente en BioModal
- [ ] ExperienceModal abre y cierra sin problemas
- [ ] EditServiceModal mantiene toda su funcionalidad
- [ ] Todos los modales cierran al presionar backdrop
- [ ] `closeAllModals()` funciona correctamente
- [ ] No hay memory leaks al abrir/cerrar modales
- [ ] La app no se siente más lenta

#### Tests de Performance:
- [ ] Monitorizar uso de memoria con modales abiertos
- [ ] Verificar que `react-native-screens` sigue activo
- [ ] Comprobar fluidez en navegación con modales abiertos

## 📁 Estructura de Archivos Final

```
src/
├── store/
│   ├── modalStore.ts (nuevo)
│   └── authStore.ts (existente)
├── components/
│   └── ModalContainer.tsx (nuevo)
├── navigation/
│   └── AppNavigator.tsx (modificado)
├── screens/profile/
│   ├── index.tsx (modificado)
│   └── components/modals/
│       ├── BioModal.tsx (modificado)
│       ├── ExperienceModal.tsx (modificado)
│       └── EditServiceModal.tsx (modificado)
└── MODAL_IMPLEMENTATION_PLAN.md (este archivo)
```

## 🚀 Ventajas de esta Implementación

### Performance
- ✅ Mantiene `react-native-screens` activado
- ✅ Sin overhead adicional significativo
- ✅ Modales renderizados eficientemente

### Arquitectura
- ✅ Control centralizado en Zustand
- ✅ Sin prop drilling
- ✅ Fácil de mantener y escalar
- ✅ Componentes desacoplados

### UX
- ✅ Modales verdaderamente globales
- ✅ Teclado y scroll funcionan correctamente
- ✅ Sin interrupciones del NavigationContainer

### Desarrollo
- ✅ Fácil de agregar nuevos modales
- ✅ Debugging centralizado
- ✅ Testing simplificado

## 🔄 Flujo de Trabajo Recomendado

1. **Implementar Fase 1** (Store + Container + Integración)
2. **Test básico** con un solo modal (BioModal)
3. **Migrar modales restantes** uno por uno
4. **Testing completo** de todos los flujos
5. **Performance testing** en dispositivos reales

## ⚠️ Consideraciones Importantes

- **No remover** los archivos de modales existentes, solo modificarlos
- **Mantener** toda la lógica de negocio existente
- **Testear** en dispositivos de gama media
- **Monitorizar** el uso de memoria después de la implementación

## 🎉 Resultado Esperado

Al finalizar esta implementación:
- Todos los modales funcionarán correctamente con teclado y scroll
- La app mantendrá su rendimiento óptimo
- Tendrás una arquitectura escalable para futuros modales
- El código será más mantenible y limpio
