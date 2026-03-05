import React from 'react';
import { Alert } from 'react-native';
import { useModalStore } from '../store/modalStore';
import { AcercaDeMiModal } from '../screens/profile/components/modals/AcercaDeMiModal';
import { ExperienceModal } from '../screens/profile/components/modals/ExperienceModal';
import { EditServiceModal } from '../screens/profile/components/modals/EditServiceModal';
import { SocialLinksModal } from '../screens/profile/components/modals';
import { StudiesModal } from '../screens/profile/components/modals/StudiesModal';
import { CategoryModal } from '../screens/profile/components/modals';
import { InfoProfesionalModal } from '../screens/profile/components/modals/InfoProfesionalModal';
import { EditHeaderModal } from '../screens/profile/components/modals/EditHeaderModal';
import { EditProductModal } from '../screens/profile/components/modals/EditProductModal';
import { EditEventModal } from '../screens/profile/components/modals/EditEventModal';
import { CompanyModal } from '../screens/profile/components/modals/CompanyModal';
import { VideoModal } from '../screens/profile/components/modals/VideoModal';

interface ModalContainerProps {
  onSaveSocialLinks?: (data: any) => void;
  onSaveExperience?: (data: any) => void;
  onSaveStudies?: (data: any) => void;
  onSaveDescription?: (value: string) => void;
  onSaveService?: (data: any) => void;
  onSaveCategory?: (data: any) => void;
  onSaveInfoProfesional?: (data: any) => void;
  onSaveEditHeader?: (data: any) => void;
  onSaveEditProduct?: (data: any) => void;
  onSaveEditEvent?: (data: any) => void;
  onSaveCompany?: (data: any) => void;
  onSaveVideo?: (data: any) => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ 
  onSaveSocialLinks,
  onSaveExperience,
  onSaveStudies,
  onSaveDescription,
  onSaveService,
  onSaveCategory,
  onSaveInfoProfesional,
  onSaveEditHeader,
  onSaveEditProduct,
  onSaveEditEvent,
  onSaveCompany,
  onSaveVideo
}) => {
  const {
    acercaDeMiModal,
    experienceModal,
    editServiceModal,
    socialLinksModal,
    studiesModal,
    categoryModal,
    infoProfesionalModal,
    editHeaderModal,
    editProductModal,
    editEventModal,
    companyModal,
    videoModal,
    closeAcercaDeMiModal,
    closeExperienceModal,
    closeEditServiceModal,
    closeSocialLinksModal,
    closeStudiesModal,
    closeCategoryModal,
    closeInfoProfesionalModal,
    closeEditHeaderModal,
    closeEditProductModal,
    closeEditEventModal,
    closeCompanyModal,
    closeVideoModal,
  } = useModalStore();

  return (
    <>
      {/* Acerca de Mí Modal */}
      <AcercaDeMiModal
        visible={acercaDeMiModal.visible}
        initialValue={acercaDeMiModal.initialValue}
        onClose={closeAcercaDeMiModal}
        onSave={async (value) => {
          await onSaveDescription?.(value);
        }}
      />
      
      {/* Experience Modal */}
      <ExperienceModal
        visible={experienceModal.visible}
        initialExperience={experienceModal.data || []}
        onClose={closeExperienceModal}
        onSave={(data) => {
          // Guardar la experiencia usando la función pasada como prop
          console.log('[ModalContainer] Guardando experiencia:', data);
          onSaveExperience?.(data);
          closeExperienceModal();
        }}
      />
      
      {/* Edit Service Modal */}
      <EditServiceModal
        visible={editServiceModal.visible}
        service={editServiceModal.service}
        onClose={closeEditServiceModal}
        onSave={async (data) => {
          // Guardar el servicio usando la función pasada como prop
          await onSaveService?.(data);
          closeEditServiceModal();
        }}
      />

      {/* Social Links Modal */}
      <SocialLinksModal
        visible={socialLinksModal.visible}
        initialData={socialLinksModal.data || {}}
        onClose={closeSocialLinksModal}
        onSave={(data) => {
          // Guardar los social links usando la función pasada como prop
          console.log('[ModalContainer] Guardando social links:', data);
          closeSocialLinksModal();
          Promise.resolve(onSaveSocialLinks?.(data)).catch(() => {
            Alert.alert('Error', 'No se pudieron guardar las redes sociales.');
          });
        }}
      />

      {/* Studies Modal */}
      <StudiesModal
        visible={studiesModal.visible}
        initialStudies={studiesModal.data || []}
        onClose={closeStudiesModal}
        onSave={(data) => {
          // Guardar los estudios usando la función pasada como prop
          console.log('[ModalContainer] Guardando estudios:', data);
          onSaveStudies?.(data);
          closeStudiesModal();
        }}
      />

      {/* Category Modal */}
      <CategoryModal
        visible={categoryModal.visible}
        initialData={categoryModal.data || {}}
        onClose={closeCategoryModal}
        onSave={(data) => {
          // Guardar la categoría usando la función pasada como prop
          console.log('[ModalContainer] Guardando categoría:', data);
          onSaveCategory?.(data);
          closeCategoryModal();
        }}
      />

      {/* Info Profesional Modal */}
      <InfoProfesionalModal
        visible={infoProfesionalModal.visible}
        initialData={infoProfesionalModal.data || {}}
        onClose={closeInfoProfesionalModal}
        onSave={(data) => {
          // Guardar la info profesional usando la función pasada como prop
          console.log('[ModalContainer] Guardando info profesional:', data);
          onSaveInfoProfesional?.(data);
          closeInfoProfesionalModal();
        }}
      />

      {/* Edit Header Modal */}
      <EditHeaderModal
        visible={editHeaderModal.visible}
        artist={editHeaderModal.artist}
        onClose={closeEditHeaderModal}
        onSave={(data) => {
          // Guardar el header usando la función pasada como prop
          console.log('[ModalContainer] Guardando header:', data);
          onSaveEditHeader?.(data);
          closeEditHeaderModal();
        }}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        visible={editProductModal.visible}
        product={editProductModal.product}
        onClose={closeEditProductModal}
        onSave={(data) => {
          // Guardar el producto usando la función pasada como prop
          onSaveEditProduct?.(data);
          closeEditProductModal();
        }}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        visible={editEventModal.visible}
        event={editEventModal.event}
        onClose={closeEditEventModal}
        onSave={(data) => {
          // Guardar el evento usando la función pasada como prop
          onSaveEditEvent?.(data);
          closeEditEventModal();
        }}
      />

      {/* Company Modal */}
      <CompanyModal
        visible={companyModal.visible}
        artist={companyModal.artist}
        onClose={closeCompanyModal}
        onSave={(data) => {
          // Guardar la empresa usando la función pasada como prop
          onSaveCompany?.(data);
          closeCompanyModal();
        }}
      />

      {/* Video Modal */}
      <VideoModal
        visible={videoModal.visible}
        video={videoModal.video}
        onClose={closeVideoModal}
        onSave={async (data) => {
          // Guardar el video usando la función pasada como prop
          await onSaveVideo?.(data);
          closeVideoModal();
        }}
      />
    </>
  );
};
