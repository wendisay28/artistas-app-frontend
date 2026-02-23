import React from 'react';
import { useModalStore } from '../store/modalStore';
import { BioModal } from '../screens/profile/components/modals/BioModal';
import { ExperienceModal } from '../screens/profile/components/modals/ExperienceModal';
import { EditServiceModal } from '../screens/profile/components/modals/EditServiceModal';
import { SocialLinksModal } from '../screens/profile/components/modals';
import { StudiesModal } from '../screens/profile/components/modals/StudiesModal';
import { CategoryModal } from '../screens/profile/components/modals';
import { InfoProfesionalModal } from '../screens/profile/components/modals/InfoProfesionalModal';

interface ModalContainerProps {
  onSaveSocialLinks?: (data: any) => void;
  onSaveExperience?: (data: any) => void;
  onSaveStudies?: (data: any) => void;
  onSaveBio?: (value: string) => void;
  onSaveService?: (data: any) => void;
  onSaveCategory?: (data: any) => void;
  onSaveInfoProfesional?: (data: any) => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ 
  onSaveSocialLinks,
  onSaveExperience,
  onSaveStudies,
  onSaveBio,
  onSaveService,
  onSaveCategory,
  onSaveInfoProfesional
}) => {
  const {
    bioModal,
    experienceModal,
    editServiceModal,
    socialLinksModal,
    studiesModal,
    categoryModal,
    infoProfesionalModal,
    closeBioModal,
    closeExperienceModal,
    closeEditServiceModal,
    closeSocialLinksModal,
    closeStudiesModal,
    closeCategoryModal,
    closeInfoProfesionalModal,
  } = useModalStore();

  return (
    <>
      {/* Bio Modal */}
      <BioModal
        visible={bioModal.visible}
        initialValue={bioModal.initialValue}
        onClose={closeBioModal}
        onSave={(value) => {
          // Guardar la bio usando la función pasada como prop
          onSaveBio?.(value);
          closeBioModal();
        }}
      />
      
      {/* Experience Modal */}
      <ExperienceModal
        visible={experienceModal.visible}
        initialExperience={experienceModal.data || []}
        onClose={closeExperienceModal}
        onSave={(data) => {
          // Guardar la experiencia usando la función pasada como prop
          onSaveExperience?.(data);
          closeExperienceModal();
        }}
      />
      
      {/* Edit Service Modal */}
      <EditServiceModal
        visible={editServiceModal.visible}
        service={editServiceModal.service}
        onClose={closeEditServiceModal}
        onSave={(data) => {
          // Guardar el servicio usando la función pasada como prop
          onSaveService?.(data);
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
          onSaveSocialLinks?.(data);
          closeSocialLinksModal();
        }}
      />

      {/* Studies Modal */}
      <StudiesModal
        visible={studiesModal.visible}
        initialStudies={studiesModal.data || []}
        onClose={closeStudiesModal}
        onSave={(data) => {
          // Guardar los estudios usando la función pasada como prop
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
          onSaveInfoProfesional?.(data);
          closeInfoProfesionalModal();
        }}
      />
    </>
  );
};
